import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaMemberRepository } from './prisma/repositories/prisma-member-repository'

@Module({
  providers: [PrismaService, PrismaMemberRepository],
  exports: [PrismaService, PrismaMemberRepository],
})
export class DatabaseModule {}
