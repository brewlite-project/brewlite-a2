import 'dotenv/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { createPrismaRuntimeAdapter } from './prisma.connection.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const { adapter } = createPrismaRuntimeAdapter(process.env);
    super({
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    // The Render Internal adapter passes disposeExternalPool=true, so this
    // releases its pg.Pool exactly through Prisma's normal shutdown path.
    await this.$disconnect();
  }
}
