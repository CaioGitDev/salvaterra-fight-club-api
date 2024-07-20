import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'

const putCategoryIdParamSchema = z.string().uuid()
const putCategoryBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
})

type PutCategoryBodySchema = z.infer<typeof putCategoryBodySchema>
type PutCategoryIdParamSchema = z.infer<typeof putCategoryIdParamSchema>

const bodyValidationPipe = new ZodValidationPipe(putCategoryBodySchema)
const paramValidationPipe = new ZodValidationPipe(putCategoryIdParamSchema)

@Controller('/category/:id')
@UseGuards(JwtAuthGuard)
export class PutCategoryController {
  constructor(private prisma: PrismaService) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: PutCategoryBodySchema,
    @CurrentUser() user: TokenPayload,
    @Param('id', paramValidationPipe) id: PutCategoryIdParamSchema,
  ) {
    const { sub: userId } = user

    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id,
      },
    })

    if (!categoryExists) throw new Error('Category not found')

    const updatedCategory = await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        ...body,
        userId,
      },
    })

    return updatedCategory
  }
}
