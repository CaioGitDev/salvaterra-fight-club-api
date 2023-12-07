import { Body, Controller, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'

const putAddressBodySchema = z.object({
  memberId: z.string().uuid(),
  address: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  parish: z.string().optional(),
  postalCode: z.string().optional(),
})

type PutAddressBodySchema = z.infer<typeof putAddressBodySchema>

const bodyValidationPipe = new ZodValidationPipe(putAddressBodySchema)

@Controller('/member/address')
@UseGuards(JwtAuthGuard)
export class PutMemberAddressController {
  constructor(private prisma: PrismaService) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: PutAddressBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user
    const { memberId, address, city, county, parish, postalCode } = body

    const addressExists = await this.prisma.address.findFirst({
      where: {
        memberId,
      },
    })

    if (!addressExists) throw new Error('Member address not found')

    const updatedAddress = await this.prisma.address.update({
      where: {
        id: addressExists.id,
      },
      data: {
        address,
        city,
        county,
        parish,
        postalCode,
      },
    })

    return updatedAddress
  }
}
