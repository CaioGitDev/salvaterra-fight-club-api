import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateMemberController } from './controllers/create-member.controller'
import { FetchMembersController } from './controllers/fetch-members.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { PutMemberAddressController } from './controllers/put-member-address.controller'
import { DatabaseModule } from '../database/database.module'
import { PutMemberIdentityDocumentController } from './controllers/put-member-identity-document.controller'
import { CreateMemberGuardianController } from './controllers/create-member-guardian.controller'
import { PutMemberGuardianController } from './controllers/put-member-guardian.controller'
import { GetMemberController } from './controllers/get-member.controller'
import { GetMemberGuardianController } from './controllers/get-member-guardian.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateMemberController,
    FetchMembersController,
    PutMemberAddressController,
    PutMemberIdentityDocumentController,
    CreateMemberGuardianController,
    PutMemberGuardianController,
    GetMemberController,
    GetMemberGuardianController,
  ],
})
export class HttpModule {}
