import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './lib/prisma/prisma.module';
import { AccessTokenGuard } from './lib/guards';

import { AuthModule } from './auth/auth.module';
import { PrivateModule } from './private/private.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PrivateModule,
  ],
  providers: [
    {
      // All routes must have access_token to work
      // Unless they have @Public() decorator
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
