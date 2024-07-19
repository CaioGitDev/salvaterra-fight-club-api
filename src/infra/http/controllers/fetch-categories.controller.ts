import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

@Controller('/categories')
@UseGuards(JwtAuthGuard)
export class FetchCategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return {
      categories,
    }
  }
}
