import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

const memberIdQueryParamsSchema = z.string().uuid()

const paramValidationPipe = new ZodValidationPipe(memberIdQueryParamsSchema)

type MemberIdQueryParamsSchema = z.infer<typeof memberIdQueryParamsSchema>

@Controller('/member/:id')
@UseGuards(JwtAuthGuard)
export class GetMemberController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Param('id', paramValidationPipe) id: MemberIdQueryParamsSchema,
  ) {
    const member = await this.prisma.member.findUnique({
      where: {
        id,
      },
      include: {
        IdentityDocument: true,
        Guardian: true,
        Address: true,
      },
    })

    if (!member) throw new Error('Member not found')

    return member
  }
}
