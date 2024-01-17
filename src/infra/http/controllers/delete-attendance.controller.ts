import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Controller, UseGuards, Delete, Body } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteAttendanceBodySchema = z.object({
  attendanceDate: z.coerce.date(),
  memberId: z.string().uuid(),
  modalityId: z.coerce.number(),
})

type DeleteAttendanceBodySchema = z.infer<typeof deleteAttendanceBodySchema>

const bodyValidationPipe = new ZodValidationPipe(deleteAttendanceBodySchema)

@Controller('/attendances')
@UseGuards(JwtAuthGuard)
export class PutMemberController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  async handle(
    @Body(bodyValidationPipe) body: DeleteAttendanceBodySchema,
    @CurrentUser() user: TokenPayload,
  ) {
    const { sub: userId } = user

    const { attendanceDate, memberId, modalityId } = body

    await this.prisma.attendance.deleteMany({
      where: {
        attendanceDate,
        memberId,
        modalityId,
      },
    })

    return {
      message: 'Attendance deleted',
    }
  }
}
