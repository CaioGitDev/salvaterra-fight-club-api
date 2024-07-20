import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create product (E2E)', () => {
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

  test('[POST] /products', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test',
        email: 'test@gmail.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Category 1',
        description: 'Description 1',
      })

    expect(response.status).toBe(201)

    const categoryOnDatabase = await prisma.category.findFirst({
      where: { name: 'Category 1' },
    })

    expect(categoryOnDatabase).toBeTruthy()

    const responseProduct = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        quantity: 10,
        categoryId: categoryOnDatabase?.id,
      })

    expect(responseProduct.status).toBe(201)

    const productOnDatabase = await prisma.product.findFirst({
      where: { name: 'Product 1' },
      include: { Category: true },
    })

    expect(productOnDatabase).toBeTruthy()
  })
})
