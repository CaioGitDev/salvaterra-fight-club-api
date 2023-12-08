import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateMemberController } from './controllers/create-member.controller'
import { FetchMembersController } from './controllers/fetch-members.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { PutMemberAddressController } from './controllers/put-member-address.controller'
import { DatabaseModule } from '../database/database.module'
import { PutMemberIdentityDocumentController } from './controllers/put-member-identity-document.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateMemberController,
    FetchMembersController,
    PutMemberAddressController,
    PutMemberIdentityDocumentController,
  ],
})
export class HttpModule {}
