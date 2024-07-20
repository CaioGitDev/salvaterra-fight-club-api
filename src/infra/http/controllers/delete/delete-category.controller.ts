import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Controller, UseGuards, Delete, Body, Param } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const deleteCategoryParamsSchema = z.string().uuid()

type DeleteCategoryParamsSchema = z.infer<typeof deleteCategoryParamsSchema>

const paramsValidationPipe = new ZodValidationPipe(deleteCategoryParamsSchema)

@Controller('/category')
@UseGuards(JwtAuthGuard)
export class DeleteCategoryController {
  constructor(private prisma: PrismaService) {}

  @Delete('/:id')
  async handle(
    @Param('id', paramsValidationPipe) id: DeleteCategoryParamsSchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user

    const category = await this.prisma.category.delete({
      where: {
        id,
      },
    })

    return category
  }
}
