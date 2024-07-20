import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Controller, UseGuards, Delete, Param } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const deleteProductParamsSchema = z.string().uuid()

type DeleteProductParamsSchema = z.infer<typeof deleteProductParamsSchema>

const paramsValidationPipe = new ZodValidationPipe(deleteProductParamsSchema)

@Controller('/product')
@UseGuards(JwtAuthGuard)
export class DeleteProductController {
  constructor(private prisma: PrismaService) {}

  @Delete('/:id')
  async handle(
    @Param('id', paramsValidationPipe) id: DeleteProductParamsSchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user

    const product = await this.prisma.product.delete({
      where: {
        id,
      },
    })

    return product
  }
}
