import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SignupDto, LoginDto } from './dtos';

import { AuthService } from './auth.service';

import { AuthUser, Public } from 'src/lib/utils/decorators';
import { RefreshTokenGuard } from 'src/lib/utils/guards';
import { JwtPayloadWithRt } from './auth.types';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
