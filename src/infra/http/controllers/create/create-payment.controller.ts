import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Controller, UseGuards, Post, HttpCode, Body } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

type PaymentMethod =
  | 'MBWAY'
  | 'MULTIBANCO'
  | 'TRANSFERENCIA_BANCARIA'
  | 'DINHEIRO'

type PaymentType = 'COTA_MENSAL' | 'COTA_ANUAL' | 'SEGURO'

const createPaymentBodySchema = z.object({
  memberId: z.string().uuid(),
  paymentType: z.string() as z.Schema<PaymentType>,
  paymentDate: z.coerce.date(),
  paymentAmount: z.number(),
  paymentMethod: z.string() as z.Schema<PaymentMethod>,
})

type CreatePaymentBodySchema = z.infer<typeof createPaymentBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createPaymentBodySchema)
@Controller('/member/payment')
@UseGuards(JwtAuthGuard)
export class CreatePaymentController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreatePaymentBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user

    const { memberId, paymentAmount, paymentDate, paymentMethod, paymentType } =
      body

    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    })

    if (!member) {
      throw new Error('Invalid member')
    }

    const payment = await this.prisma.payment.create({
      data: {
        memberId,
        paymentAmount,
        paymentDate,
        paymentMethod,
        paymentType,
        createdBy: userId,
      },
    })

    return {
      payment,
    }
  }
}
