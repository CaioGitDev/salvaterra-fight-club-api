import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const monthParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1).max(12))

const yearParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number())

const monthValidationPipe = new ZodValidationPipe(monthParamSchema)
const yearValidationPipe = new ZodValidationPipe(yearParamSchema)

type MonthParamSchema = z.infer<typeof monthParamSchema>
type YearParamSchema = z.infer<typeof yearParamSchema>

@Controller('/members/payments/:month/:year')
@UseGuards(JwtAuthGuard)
export class FetchPaymentsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Param('month', monthValidationPipe) month: MonthParamSchema,
    @Param('year', yearValidationPipe) year: YearParamSchema,
  ) {
    const payments = await this.prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: new Date(year, month - 1),
          lt: new Date(year, month),
        },
      },
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
            IdentityDocument: {
              select: {
                taxIdentificationNumber: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    })

    // get all members without payment this month and year
    const membersWithoutPayment = await this.prisma.member.findMany({
      where: {
        id: {
          notIn: payments.map((payment) => {
            if (payment.paymentType === 'COTA_MENSAL') {
              return payment.memberId
            }
            return ''
          }),
        },
        active: true,
        memberTypeId: {
          notIn: [4, 5],
        },
      },
      select: {
        id: true,
        fullName: true,
        memberTypeId: true,
      },
    })

    // count all menbers
    const totalMembers = await this.prisma.member.count({
      where: {
        memberTypeId: {
          notIn: [4, 5],
        },
      },
    })

    const totalPaymentsAmount = payments.reduce((acc, payment) => {
      if (payment.paymentType === 'COTA_MENSAL') {
        return acc + payment.paymentAmount
      }
      return acc
    }, 0)

    return {
      payments,
      summary: {
        membersWithoutPayment,
        totalMissingPayments: membersWithoutPayment.length,
        totalMembers,
        totalPaymentsAmount,
      },
    }
  }
}
