import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>

@Controller('/members')
@UseGuards(JwtAuthGuard)
export class FetchRecentMembersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
  ) {
    const perPage = 100
    const members = await this.prisma.member.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        membershipNumber: 'desc',
      },
      include: {
        IdentityDocument: true,
        Address: true,
        Guardian: true,
      },
    })

    return {
      members,
    }
  }
}
