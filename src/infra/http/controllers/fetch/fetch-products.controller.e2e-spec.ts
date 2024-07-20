import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('List products (E2E)', () => {
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

  test('[GET] /products', async () => {
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

    await prisma.product.create({
      data: {
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        quantity: 1,
        Category: {
          connect: {
            id: category.id,
          },
        },
        userId: user.id,
      },
    })

    await prisma.product.create({
      data: {
        name: 'Product 2',
        description: 'Product 2 description',
        price: 45,
        quantity: 1,
        Category: {
          connect: {
            id: category.id,
          },
        },
        userId: user.id,
      },
    })

    const response = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    expect(response.body).toEqual({
      products: [
        expect.objectContaining({ name: 'Product 1' }),
        expect.objectContaining({ name: 'Product 2' }),
      ],
    })
  })
})
