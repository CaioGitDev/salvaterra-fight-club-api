import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Controller, Get, UseGuards } from '@nestjs/common'

@Controller('/members/payments')
@UseGuards(JwtAuthGuard)
export class FetchPaymentsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    const payments = await this.prisma.payment.findMany({
      include: {
        member: {
          select: {
            id: true,
            membershipNumber: true,
            fullName: true,
            Address: {
              select: {
                postalCode: true,
                parish: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      payments,
    }
  }
}
