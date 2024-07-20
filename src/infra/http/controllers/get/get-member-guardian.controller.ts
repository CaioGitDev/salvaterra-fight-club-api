import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const memberIdQueryParamsSchema = z.string().uuid()

const paramValidationPipe = new ZodValidationPipe(memberIdQueryParamsSchema)

type MemberIdQueryParamsSchema = z.infer<typeof memberIdQueryParamsSchema>

@Controller('/member/:id/guardian')
@UseGuards(JwtAuthGuard)
export class GetMemberGuardianController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Param('id', paramValidationPipe) id: MemberIdQueryParamsSchema,
  ) {
    const guardian = await this.prisma.guardian.findFirst({
      where: {
        memberId: id,
      },
    })

    if (!guardian) throw new NotFoundException('Guardian not found')

    return {
      guardian,
    }
  }
}
