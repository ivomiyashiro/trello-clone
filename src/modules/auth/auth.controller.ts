import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

import { AuthRequest, JwtPayloadWithRt } from './auth.types';

import { AuthUser, Public } from '../../decorators';
import { RefreshTokenGuard } from '../../guards';

import { SignupDto, LoginDto } from './dtos';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('/local/signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto) {
    try {
      const user = await this.authService.signup(signupDto);

      return {
        ok: true,
        data: {
          user,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/local/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const { user, tokens } = await this.authService.login(loginDto);

      return {
        ok: true,
        data: {
          user,
          tokens,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@AuthUser('sub') accountId: string) {
    try {
      await this.authService.logout(accountId);

      return { ok: true };
    } catch (error) {
      throw error;
    }
  }

  @Post('/generateToken')
  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async generateToken(@AuthUser() { sub, refreshToken }: JwtPayloadWithRt) {
    const data = await this.authService.generateToken(sub, refreshToken);

    return {
      ok: true,
      data,
    };
  }

  @Get('/providers/google')
  @Public()
  @UseGuards(AuthGuard('google'))
  @HttpCode(HttpStatus.OK)
  async googleAuth() {
    // This route will initiate the Google authentication flow.
  }

  @Get('/providers/google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  @HttpCode(HttpStatus.OK)
  async googleAuthCallback(@Req() req: AuthRequest, @Res() res: Response) {
    try {
      const tokens = await this.authService.providersAuthCallback(
        req,
        'google',
      );

      if (tokens) {
        return res.redirect(
          this.configService.get('CLIENT_BASE_URL') +
            `?rt=${tokens.refreshToken}`,
        );
      }

      return res.redirect(this.configService.get('CLIENT_BASE_URL'));
    } catch (error) {
      throw error;
    }
  }

  @Get('/providers/github')
  @Public()
  @UseGuards(AuthGuard('github'))
  @HttpCode(HttpStatus.OK)
  async githubAuth() {
    // This route will initiate the Github authentication flow.
  }

  @Get('/providers/github/callback')
  @Public()
  @UseGuards(AuthGuard('github'))
  @HttpCode(HttpStatus.OK)
  async githubAuthCallback(@Req() req: AuthRequest, @Res() res: Response) {
    try {
      const tokens = await this.authService.providersAuthCallback(
        req,
        'github',
      );

      if (tokens) {
        return res.redirect(
          this.configService.get('CLIENT_BASE_URL') +
            `?rt=${tokens.refreshToken}`,
        );
      }

      return res.redirect(this.configService.get('CLIENT_BASE_URL'));
    } catch (error) {
      throw error;
    }
  }
}
