import { Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { TokenPayload } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/members')
@UseGuards(JwtAuthGuard)
export class CreateMemberController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@CurrentUser() user: TokenPayload) {
    return 'ok'
  }
}
