import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateMemberController } from './controllers/create-member.controller'
import { FetchMembersController } from './controllers/fetch-members.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateMemberController,
    FetchMembersController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
