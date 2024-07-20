import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Delete category (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /category', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test',
        email: 'test@gmail.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const category = await prisma.category.create({
      data: {
        name: 'Category 1',
        description: 'Category 1 description',
        userId: user.id,
      },
    })

    const response = await request(app.getHttpServer())
      .delete(`/category/${category.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Category 1',
      }),
    )
  })
})
