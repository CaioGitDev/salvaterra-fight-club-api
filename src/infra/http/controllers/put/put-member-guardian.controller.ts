import { Body, Controller, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'

const putMemberGuardianBodySchema = z.object({
  memberId: z.string().uuid(),
  fullName: z.string().optional(),
  relationshipDegreeId: z.number().optional(),
  contact: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  parish: z.string().optional(),
  postalCode: z.string().optional(),
})

type PutMemberGuardianBodySchema = z.infer<typeof putMemberGuardianBodySchema>

const bodyValidationPipe = new ZodValidationPipe(putMemberGuardianBodySchema)

@Controller('/member/guardian')
@UseGuards(JwtAuthGuard)
export class PutMemberGuardianController {
  constructor(private prisma: PrismaService) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: PutMemberGuardianBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user

    const {
      memberId,
      fullName,
      address,
      contact,
      city,
      county,
      parish,
      postalCode,
      relationshipDegreeId,
    } = body

    const guardianExists = await this.prisma.guardian.findFirst({
      where: {
        memberId,
      },
    })

    if (!guardianExists) throw new Error('Member guardian not found')

    const updatedMemberGuardian = await this.prisma.guardian.update({
      where: {
        id: guardianExists.id,
      },
      data: {
        fullName,
        address,
        contact,
        city,
        county,
        parish,
        postalCode,
        relationshipDegreeId,
      },
    })

    return updatedMemberGuardian
  }
}
