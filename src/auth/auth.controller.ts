import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignupDto, LoginDto } from './dtos';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto) {
    try {
      const user = await this.authService.signup(signupDto);

      return {
        data: {
          user,
        },
      };
    } catch (error) {
      return error;
    }
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const { user, tokens } = await this.authService.login(loginDto);

      return {
        data: {
          user,
          tokens,
        },
      };
    } catch (error) {
      return error;
    }
  }
}
