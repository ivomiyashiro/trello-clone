import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { JwtPayload, Tokens } from './auth.types';

import { LoginDto, SignupDto } from './dtos';

import { config } from 'src/lib/config/config';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name: signupDto.name,
        email: signupDto.email,
        password: hashedPassword,
        accounts: {
          create: {
            provider: {
              connectOrCreate: {
                where: {
                  name: 'LOCAL',
                },
                create: {
                  name: 'LOCAL',
                },
              },
            },
          },
        },
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
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

    const tokens = await this.getTokens({
      sub: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    });

    await this.updateDbTokens(account.id, tokens);

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

    const tokens = await this.getTokens({
      sub: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    });

    await this.updateDbTokens(account.id, tokens);

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

  // Helpers ===>
  private async updateDbTokens(accountId: string, tokens: Tokens) {
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    await this.prismaService.account.update({
      where: { id: accountId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  private async getTokens(jwtPayload: JwtPayload) {
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
