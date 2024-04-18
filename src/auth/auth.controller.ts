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

import { AuthUser, Public } from 'src/lib/utils/decorators';
import { RefreshTokenGuard } from 'src/lib/utils/guards';

import { AuthRequest, JwtPayloadWithRt } from './auth.types';

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
      return error;
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
      return error;
    }
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@AuthUser('sub') accountId: string) {
    try {
      await this.authService.logout(accountId);

      return { ok: true };
    } catch (error) {
      return error;
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This route will initiate the Google authentication flow.
  }

  @Get('/providers/google/callback')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: AuthRequest, @Res() res: Response) {
    try {
      const tokens = await this.authService.googleAuthCallback(req);

      if (tokens) {
        return res.redirect(
          this.configService.get('CLIENT_BASE_URL') +
            `?rt=${tokens.refreshToken}`,
        );
      }

      return res.redirect(this.configService.get('CLIENT_BASE_URL'));
    } catch (error) {
      return error;
    }
  }
}
