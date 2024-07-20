import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

const createCategoryBodySchema = z.object({
  name: z.string(),
  description: z.string(),
})

type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema)

@Controller('/categories')
@UseGuards(JwtAuthGuard)
export class CreateCategoryController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateCategoryBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user
    const { name, description } = body

    const category = await this.prisma.category.create({
      data: {
        name,
        description,
        userId,
      },
    })

    return { category }
  }
}
