import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'
import { Response } from 'express'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(
    @Body() body: AuthenticateBodySchema,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not math.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not math.')
    }

    const accessToken = this.jwt.sign({
      sub: user.id,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    // add token to cookie with httponly
    response.cookie('access_token', accessToken, {
      maxAge: 1000 * 60 * 15, // expire after 15 minutes
      httpOnly: true, // Cookie will not be exposed to client side code
      sameSite: 'none', // If client and server origins are different
      secure: true, // use with HTTPS only
    })

    return {
      access_token: accessToken,
    }
  }
}
