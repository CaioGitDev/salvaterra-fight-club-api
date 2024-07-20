import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class FetchProductsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    const products = await this.prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return {
      products,
    }
  }
}
