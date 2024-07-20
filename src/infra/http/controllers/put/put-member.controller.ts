import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'

const memberIdQueryParamsSchema = z.string().uuid()

const putMemberBodySchema = z.object({
  photoUrl: z.string().optional(),
  fullName: z.string().optional(),
  genderId: z.number().optional(),
  dateOfBirth: z.date().optional(),
  nationalityId: z.number().optional(),
  placeOfBirth: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().optional(),
  modalityId: z.number().optional(),
  frequencyId: z.number().optional(),
  memberTypeId: z.number().optional(),
  paymentFrequencyId: z.number().optional(),
  termsAndConditions: z.boolean().optional(),
  healthDeclaration: z.boolean().optional(),
  createdAt: z.date().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.date().optional(),
  active: z.boolean().optional(),
})

type PutMemberBodySchema = z.infer<typeof putMemberBodySchema>
type MemberIdQueryParamsSchema = z.infer<typeof memberIdQueryParamsSchema>

const bodyValidationPipe = new ZodValidationPipe(putMemberBodySchema)
const paramValidationPipe = new ZodValidationPipe(memberIdQueryParamsSchema)

@Controller('/member/:id')
@UseGuards(JwtAuthGuard)
export class PutMemberController {
  constructor(private prisma: PrismaService) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: PutMemberBodySchema,
    @CurrentUser() user: TokenPayload,
    @Param('id', paramValidationPipe) id: MemberIdQueryParamsSchema,
  ) {
    const { sub: userId } = user

    const memberExists = await this.prisma.member.findUnique({
      where: {
        id,
      },
    })

    if (!memberExists) {
      throw new Error('Member not found')
    }

    const member = await this.prisma.member.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    })

    return {
      member,
    }
  }
}
