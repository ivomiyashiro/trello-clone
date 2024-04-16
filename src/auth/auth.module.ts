import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AccessTokenStrategy } from './strategy/accessToken.strategy';
import { RefreshTokentStrategy } from './strategy/refreshToken.strategy';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({ global: true }), PassportModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokentStrategy],
})
export class AuthModule {}
