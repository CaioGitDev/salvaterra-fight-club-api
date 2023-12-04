import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateMemberController } from './controllers/create-member.controller'
import { FetchMembersController } from './controllers/fetch-members.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateMemberController,
    FetchMembersController,
  ],
})
export class HttpModule {}
