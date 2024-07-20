import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'

const memberColumnsSchema = z.object({
  columns: z.array(z.string()),
})

const paramValidationPipe = new ZodValidationPipe(memberColumnsSchema)

type MemberColumnsSchema = z.infer<typeof memberColumnsSchema>

@Controller('/members/columns')
@UseGuards(JwtAuthGuard)
export class FetchMembersColumnsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(paramValidationPipe) data: MemberColumnsSchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user

    const members = await this.prisma.member.findMany({
      select: data.columns.reduce((acc, column) => {
        return {
          ...acc,
          [column]: true,
        }
      }, {}),
    })

    if (!members) throw new Error('Member not found')

    return {
      members,
    }
  }
}
