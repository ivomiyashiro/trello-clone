import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AccessTokenGuard, WorkspaceAdminGuard } from './guards';

import { PrismaModule } from './lib/prisma/prisma.module';

import { AuthModule } from './modules/auth/auth.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    WorkspaceModule,
  ],
  providers: [
    {
      // All routes must have access_token to work
      // Unless they have @Public() decorator
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      // Routes with @WorkspaceAdmin() can only be acceed
      // by the workspace admin.
      provide: APP_GUARD,
      useClass: WorkspaceAdminGuard,
    },
  ],
})
export class AppModule {}
