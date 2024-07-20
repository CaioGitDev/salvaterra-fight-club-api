import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'

const putProductIdParamSchema = z.string().uuid()

const putProductBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
  categoryId: z.string().uuid().optional(),
})

type PutProductIdParamSchema = z.infer<typeof putProductIdParamSchema>
type PutProductBodySchema = z.infer<typeof putProductBodySchema>

const paramValidationPipe = new ZodValidationPipe(putProductIdParamSchema)
const bodyValidationPipe = new ZodValidationPipe(putProductBodySchema)

@Controller('/product/:id')
@UseGuards(JwtAuthGuard)
export class PutProductController {
  constructor(private prisma: PrismaService) {}

  @Put()
  async handle(
    @Param('id', paramValidationPipe) id: PutProductIdParamSchema,
    @Body(bodyValidationPipe) body: PutProductBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user
    const { categoryId } = body

    const productExists = await this.prisma.product.findUnique({
      where: {
        id,
      },
    })

    if (!productExists) throw new NotFoundException('Product not found')

    // check if category exists
    if (categoryId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      })

      if (!categoryExists) throw new NotFoundException('Category not found')
    }

    const updatedProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...body,
        userId,
      },
    })

    return updatedProduct
  }
}
