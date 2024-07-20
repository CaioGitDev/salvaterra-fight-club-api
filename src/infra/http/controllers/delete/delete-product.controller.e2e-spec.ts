import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Delete product (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  const createUserAsync = async () => {
    return await prisma.user.create({
      data: {
        name: 'Test',
        email: 'test@gmail.com',
        password: '123456',
      },
    })
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  afterEach(async () => {
    // clear database after each test
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
  })

  test('[DELETE] /product', async () => {
    const { id: userId } = await createUserAsync()

    const accessToken = jwt.sign({ sub: userId })

    const category = await prisma.category.create({
      data: {
        name: 'Category 1',
        description: 'Category 1 description',
        userId,
      },
    })

    const { id } = await prisma.product.create({
      data: {
        name: 'Product 1',
        description: 'Product 1 description',
        price: 10,
        quantity: 10,
        categoryId: category.id,
        userId,
      },
    })

    const response = await request(app.getHttpServer())
      .delete(`/product/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Product 1',
      }),
    )
  })
})
