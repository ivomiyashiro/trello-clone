import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AccessTokenStrategy } from './strategy/accessToken.strategy';
import { RefreshTokentStrategy } from './strategy/refreshToken.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({ global: true }), PassportModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokentStrategy],
})
export class AuthModule {}
