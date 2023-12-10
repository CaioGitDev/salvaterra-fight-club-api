import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

const createMemberGuardianBodySchema = z.object({
  memberId: z.string().uuid(),
  fullName: z.string(),
  relationshipDegreeId: z.number(),
  contact: z.string(),
  address: z.string(),
  city: z.string(),
  county: z.string(),
  parish: z.string(),
  postalCode: z.string(),
})

type CreateMemberGuardianBodySchema = z.infer<
  typeof createMemberGuardianBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(createMemberGuardianBodySchema)

@Controller('/member/guardian')
@UseGuards(JwtAuthGuard)
export class CreateMemberGuardianController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateMemberGuardianBodySchema,
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

    // check if member already exists
    const memberExists = await this.prisma.member.findFirst({
      where: {
        id: memberId,
      },
    })

    if (!memberExists) throw new Error('Member do not exists')

    const memberGuardian = await this.prisma.guardian.create({
      data: {
        memberId,
        relationshipDegreeId,
        fullName,
        address,
        contact,
        city,
        county,
        parish,
        postalCode,
      },
    })

    return memberGuardian
  }
}
