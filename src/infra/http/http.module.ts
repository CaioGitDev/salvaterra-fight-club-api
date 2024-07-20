import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateMemberController } from './controllers/create/create-member.controller'
import { FetchMembersController } from './controllers/fetch/fetch-members.controller'
import { CreateAccountController } from './controllers/create/create-account.controller'
import { PutMemberAddressController } from './controllers/put/put-member-address.controller'
import { DatabaseModule } from '../database/database.module'
import { PutMemberIdentityDocumentController } from './controllers/put/put-member-identity-document.controller'
import { CreateMemberGuardianController } from './controllers/create/create-member-guardian.controller'
import { PutMemberGuardianController } from './controllers/put/put-member-guardian.controller'
import { GetMemberController } from './controllers/get/get-member.controller'
import { GetMemberGuardianController } from './controllers/get/get-member-guardian.controller'
import { FetchMembersColumnsController } from './controllers/fetch/fetch-members-columns.controller'
import { CreatePaymentController } from './controllers/create/create-payment.controller'
import { FetchPaymentsController } from './controllers/fetch/fetch-payments.controller'
import { CreatePaymentReceiptController } from './controllers/create/create-payment-receipt.controller'
import { PutMemberController } from './controllers/put/put-member.controller'
import { CreateAttendanceController } from './controllers/create/create-attendance.controller'
import { CreateCategoryController } from './controllers/create/create-category.controller'
import { FetchCategoriesController } from './controllers/fetch/fetch-categories.controller'
import { PutCategoryController } from './controllers/put/put-category.controller'
import { DeleteCategoryController } from './controllers/delete/delete-category.controller'
import { CreateProductController } from './controllers/create/create-product.controller'

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
    FetchMembersColumnsController,
    GetMemberGuardianController,
    CreatePaymentController,
    FetchPaymentsController,
    CreatePaymentReceiptController,
    PutMemberController,
    CreateAttendanceController,
    CreateCategoryController,
    FetchCategoriesController,
    PutCategoryController,
    DeleteCategoryController,
    CreateProductController,
  ],
})
export class HttpModule {}
