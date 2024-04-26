import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    return this.$transaction([
      this.user.deleteMany(),
      this.accountProvider.deleteMany(),
      this.account.deleteMany(),
    ]);
  }
}
