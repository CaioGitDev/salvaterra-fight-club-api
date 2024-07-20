import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

const createAttendanceBodySchema = z.object({
  attendanceDate: z.coerce.date(),
  memberId: z.string().uuid(),
  modalityId: z.coerce.number(),
})

type CreateAttendanceBodySchema = z.infer<typeof createAttendanceBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createAttendanceBodySchema)

@Controller('/attendances')
@UseGuards(JwtAuthGuard)
export class CreateAttendanceController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateAttendanceBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user
    const { attendanceDate, memberId, modalityId } = body

    const memberAlreadyHasAttendance = await this.prisma.attendance.findFirst({
      where: {
        memberId,
        attendanceDate,
        modalityId,
      },
    })

    if (memberAlreadyHasAttendance) {
      return {
        message: 'Member already has attendance on this date',
      }
    }

    const attendance = await this.prisma.attendance.create({
      data: {
        attendanceDate,
        memberId,
        modalityId,
        createdBy: userId,
      },
    })

    return {
      attendance,
    }
  }
}
