import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

const createProductBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  quantity: z.number(),
  categoryId: z.string(),
})

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema)

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class CreateProductController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateProductBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user
    const { name, description, price, quantity, categoryId } = body

    // check if category exists
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId },
    })

    if (!category) {
      throw new Error('Category not found')
    }

    // check if product name already exists
    const productAlreadyExists = await this.prisma.product.findFirst({
      where: { name },
    })

    if (productAlreadyExists) {
      throw new Error('Product already exists')
    }

    const product = await this.prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
        categoryId,
        userId,
      },
    })

    return { product }
  }
}
