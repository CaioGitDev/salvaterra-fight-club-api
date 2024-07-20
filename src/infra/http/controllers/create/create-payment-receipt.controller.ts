import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

const createPaymentReceiptBodySchema = z.object({
  paymentId: z.string().uuid(),
  receiptTaxDescription: z.string(),
  receiptTaxPercentage: z.number(),
})

type CreatePaymentReceiptBodySchema = z.infer<
  typeof createPaymentReceiptBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(createPaymentReceiptBodySchema)

@Controller('/payment/receipts')
@UseGuards(JwtAuthGuard)
export class CreatePaymentReceiptController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreatePaymentReceiptBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user
    const { paymentId, receiptTaxDescription, receiptTaxPercentage } = body

    const payment = await this.prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    })

    if (!payment) throw new Error('Payment not found')

    const paymentReceipt = await this.prisma.paymentRecipts.findFirst({
      where: {
        paymentId,
      },
    })

    if (paymentReceipt) {
      return { receipt: paymentReceipt }
    }
    // create method to generate sequencial number with this format 001/2023
    const currentYear = new Date().getFullYear()
    const { receiptNumber } = await this.prisma.paymentRecipts.count({
      select: {
        receiptNumber: true,
      },
      where: {
        receiptYear: currentYear,
      },
    })

    const receipt = await this.prisma.paymentRecipts.create({
      data: {
        paymentId,
        receiptNumber: receiptNumber + 1,
        receiptYear: currentYear,
        receiptTaxDescription,
        receiptTaxPercentage,
        createdBy: userId,
      },
    })

    return {
      receipt,
    }
  }
}
