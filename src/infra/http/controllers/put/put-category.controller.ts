import { Body, Controller, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'

const putCategoryBodySchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
})

type PutCategoryBodySchema = z.infer<typeof putCategoryBodySchema>

const bodyValidationPipe = new ZodValidationPipe(putCategoryBodySchema)

@Controller('/category')
@UseGuards(JwtAuthGuard)
export class PutCategoryController {
  constructor(private prisma: PrismaService) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: PutCategoryBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user
    const { id, name, description } = body

    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id,
      },
    })

    if (!categoryExists) throw new Error('Category not found')

    const updatedCategory = await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        userId,
      },
    })

    return updatedCategory
  }
}
