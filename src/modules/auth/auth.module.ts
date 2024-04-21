import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import {
  AccessTokenStrategy,
  RefreshTokentStrategy,
  GoogleAuthStrategy,
  GithubAuthStrategy,
} from './strategy';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({ global: true }), PassportModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokentStrategy,
    GoogleAuthStrategy,
    GithubAuthStrategy,
  ],
})
export class AuthModule {}
