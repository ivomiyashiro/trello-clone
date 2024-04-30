import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { AccountProvider, Prisma, Providers, User } from '@prisma/client';
import { AuthRequest, JwtPayload } from './auth.types';

import { config } from '../../config/config';

import { LoginDto, SignupDto } from './dtos';

import { PrismaService } from '../../lib/prisma/prisma.service';
import { generarPassword } from '../../utils/generatePassword';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const localProvider = await this.getOrCreateAuthProvider('local');

    const user = await this.prismaService.user.findUnique({
      where: {
        email: signupDto.email,
      },
      include: {
        accounts: true,
      },
    });

    // Check if user already has a local account.
    if (user) {
      const userAccount = user.accounts.find(
        (acc) => acc.accountProviderId === localProvider.id,
      );

      if (userAccount) {
        throw new BadRequestException('Email is already in use.');
      }

      await this.createUserAccount(
        { ...user, password: signupDto.password },
        localProvider,
      );

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    }

    // Creates the new user with his local account.
    const newUser = await this.createUserAndAccount({
      name: signupDto.name,
      email: signupDto.email,
      password: await bcrypt.hash(signupDto.password, 10),
      accountProviderId: localProvider.id,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
    };
  }

  async login(loginDto: LoginDto) {
    const ERROR = ['Email or password incorrect.'];

    const account = await this.prismaService.account.findFirst({
      where: {
        user: {
          email: loginDto.email,
        },
      },
      include: {
        user: true,
      },
    });

    if (!account) {
      throw new BadRequestException(ERROR);
    }

    const user = account.user;

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new BadRequestException(ERROR);
    }

    const tokens = await this.createTokens({
      sub: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    });

    await this.updateDbRefreshToken(account.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      tokens,
    };
  }

  async logout(userId: string) {
    await this.prismaService.account.updateMany({
      where: {
        userId,
        refreshToken: { not: null },
      },
      data: { refreshToken: null },
    });

    return true;
  }

  async generateToken(userId: string, refreshToken: string) {
    const account = await this.prismaService.account.findFirstOrThrow({
      where: { userId },
      include: { user: true },
    });

    const user = account.user;

    if (!account || !account.refreshToken) {
      throw new ForbiddenException('Access Denied.');
    }

    const rtMatches = await bcrypt.compare(refreshToken, account.refreshToken);

    if (!rtMatches) throw new ForbiddenException('Access Denied.');

    const tokens = await this.createTokens({
      sub: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    });

    await this.updateDbRefreshToken(account.id, tokens.refreshToken);

    return {
      user: {
        id: user.name,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      tokens,
    };
  }

  async providersAuthCallback(req: AuthRequest, provider: Providers) {
    const { id, email, name, image, accounts } = req.user;

    const providerAccount = await this.prismaService.accountProvider.findUnique(
      { where: { name: provider } },
    );

    const tokens = await this.createTokens({
      sub: id,
      email,
      name,
      image,
    });

    if (!tokens) return null;

    const { id: providerAccountID } = accounts.find(
      (acc) => acc.accountProviderId === providerAccount.id,
    );

    await this.updateDbRefreshToken(providerAccountID, tokens.refreshToken);

    return tokens;
  }

  // This function is used in the providers auth strategies.
  async getOrCreateUserAccount(
    userData: Partial<User>,
    accountProvider: Providers,
  ) {
    const authProvider = await this.getOrCreateAuthProvider(accountProvider);

    const user = await this.prismaService.user.findUnique({
      where: { email: userData.email },
      include: { accounts: true },
    });

    if (!user) {
      // Creates the new user with his provider account.
      const newUser = await this.createUserAndAccount({
        name: userData.name,
        email: userData.email,
        image: userData.image,
        password: await bcrypt.hash(generarPassword(), 10),
        accountProviderId: authProvider.id,
      });

      return newUser;
    }

    // Check if user has provider account created.
    const userAccount = user.accounts.find(
      (acc) => acc.accountProviderId === authProvider.id,
    );

    if (userAccount) return user;

    // Creates a new provider account for the existing user.
    const userWithNewAcc = await this.createUserAccount(
      {
        ...user,
        image: user.image ? user.image : userData.image,
      },
      authProvider,
    );

    return userWithNewAcc;
  }

  // HELPERS ===>

  // Check if provider already exists in accountProvider table.
  // If it does not exists, It will create it.
  private async getOrCreateAuthProvider(provider: Providers) {
    const existsProvider = await this.prismaService.accountProvider.findUnique({
      where: {
        name: provider,
      },
    });

    if (!existsProvider) {
      const newProvider = await this.prismaService.accountProvider.create({
        data: {
          name: provider,
        },
      });
      return newProvider;
    }

    return existsProvider;
  }

  private async createUserAccount(user: User, provider: AccountProvider) {
    let data: Prisma.UserUpdateInput = {
      accounts: {
        create: {
          accountProviderId: provider.id,
        },
      },
    };

    // If new account is local, update the password for the password given
    if (provider.name === 'local') {
      data = {
        ...data,
        password: await bcrypt.hash(user.password, 10),
      };
    }

    const userWithNewAcc = await this.prismaService.user.update({
      where: { id: user.id },
      data,
      include: {
        accounts: true,
      },
    });

    return userWithNewAcc;
  }

  private async createUserAndAccount({
    name,
    email,
    image,
    password,
    accountProviderId,
  }: {
    name?: string | null;
    email: string;
    image?: string | null;
    password: string;
    accountProviderId: string;
  }) {
    return await this.prismaService.user.create({
      data: {
        name,
        email,
        image,
        password,
        accounts: {
          create: {
            accountProviderId,
          },
        },
      },
      include: {
        accounts: true,
      },
    });
  }

  private async updateDbRefreshToken(
    accountProviderId: string,
    refreshToken: string,
  ) {
    await this.prismaService.account.update({
      where: { id: accountProviderId },
      data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
    });
  }

  private async createTokens(jwtPayload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: config.ACCESS_TOKEN_EXP_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: config.REFRESH_TOKEN_EXP_TIME,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
