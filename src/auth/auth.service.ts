import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { Account, AccountProvider, Providers, User } from '@prisma/client';
import { AuthRequest, JwtPayload } from './auth.types';

import { config } from 'src/lib/config/config';

import { LoginDto, SignupDto } from './dtos';
import { PrismaService } from 'src/lib/prisma/prisma.service';

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
      await this.getOrCreateUserAccount(
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
        id: user.name,
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

  async googleAuthCallback(req: AuthRequest) {
    const { id, email, name, image, accounts } = req.user;

    const googleAccount = await this.prismaService.accountProvider.findUnique({
      where: { name: 'google' },
    });

    const tokens = await this.createTokens({
      sub: id,
      email,
      name,
      image,
    });

    if (!tokens) {
      return null;
    }

    const { id: googleAccountID } = accounts.find(
      (acc) => acc.accountProviderId === googleAccount.id,
    );

    await this.updateDbRefreshToken(googleAccountID, tokens.refreshToken);

    return tokens;
  }

  // Check if google provider already exists.
  // If it does not exists, It will create it.
  async getOrCreateAuthProvider(provider: Providers) {
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

  // Check if user has account created.
  // If does not have account, It will create it.
  async getOrCreateUserAccount(
    user: User & { accounts: Account[] },
    provider: AccountProvider,
  ) {
    const userAccount = user.accounts.find(
      (acc) => acc.accountProviderId === provider.id,
    );

    if (userAccount) return userAccount;

    const { accounts: newAccount } = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(user.password, 10),
        accounts: {
          create: {
            accountProviderId: provider.id,
          },
        },
      },
      select: {
        accounts: {
          where: {
            accountProviderId: provider.id,
          },
        },
      },
    });

    return newAccount[0];
  }

  async createUserAndAccount({
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

  // Helpers ===>
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
