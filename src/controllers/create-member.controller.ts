import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/members')
@UseGuards(JwtAuthGuard)
export class CreateMemberController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle() {
    return 'ok'
  }
}
