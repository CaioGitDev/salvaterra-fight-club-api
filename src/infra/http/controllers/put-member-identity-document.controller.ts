import { Body, Controller, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'

const putIdentityDocumentBodySchema = z.object({
  memberId: z.string().uuid(),
  identityDocumentTypeId: z.number().optional(),
  identificationNumber: z.string().optional(),
  expireDate: z.coerce.date().optional(),
  taxIdentificationNumber: z.string().optional(),
})

type PutIdentityDocumentBodySchema = z.infer<
  typeof putIdentityDocumentBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(putIdentityDocumentBodySchema)

@Controller('/member/identity-document')
@UseGuards(JwtAuthGuard)
export class PutMemberIdentityDocumentController {
  constructor(private prisma: PrismaService) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: PutIdentityDocumentBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user
    const {
      memberId,
      identityDocumentTypeId,
      identificationNumber,
      expireDate,
      taxIdentificationNumber,
    } = body

    const identityDocumentExists = await this.prisma.identityDocument.findFirst(
      {
        where: {
          memberId,
        },
      },
    )

    if (!identityDocumentExists)
      throw new Error('Member identity document not found')

    const updatedIdentityDocument = await this.prisma.identityDocument.update({
      where: {
        id: identityDocumentExists.id,
      },
      data: {
        identityDocumentTypeId,
        identificationNumber,
        expireDate,
        taxIdentificationNumber,
      },
    })

    return updatedIdentityDocument
  }
}
