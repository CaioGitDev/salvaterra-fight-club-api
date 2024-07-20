import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { randomUUID } from 'crypto'
import request from 'supertest'

describe('Put Product (E2E)', () => {
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

  test('[PUT] /Product', async () => {
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
        price: 100,
        quantity: 1,
        Category: {
          connect: {
            id: category.id,
          },
        },
        userId,
      },
    })

    const response = await request(app.getHttpServer())
      .put(`/product/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'product 1 updated',
        description: 'product 1 description updated',
      })

    expect(response.status).toBe(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'product 1 updated',
      }),
    )
  })

  test('[PUT] /Product - Product not found', async () => {
    const { id: userId } = await createUserAsync()

    const accessToken = jwt.sign({ sub: userId })

    const response = await request(app.getHttpServer())
      .put(`/product/${randomUUID()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'product 1 updated',
        description: 'product 1 description updated',
      })

    expect(response.status).toBe(404)

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Product not found',
      }),
    )
  })

  test('[PUT] /Product  - Category Updated', async () => {
    const { id: userId } = await createUserAsync()

    const accessToken = jwt.sign({ sub: userId })

    const category = await prisma.category.create({
      data: {
        name: 'Category 1',
        description: 'Category 1 description',
        userId,
      },
    })

    const category2 = await prisma.category.create({
      data: {
        name: 'Category 2',
        description: 'Category 2 description',
        userId,
      },
    })

    const { id } = await prisma.product.create({
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
        userId,
      },
    })

    // alter category
    const response = await request(app.getHttpServer())
      .put(`/product/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        Category: category2.id,
      })

    console.log(response)
    expect(response.body).toEqual(
      expect.objectContaining({
        categoryId: category2.id,
      }),
    )
  })

  test('[PUT] /Product - Category not found', async () => {
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
        price: 100,
        quantity: 1,
        Category: {
          connect: {
            id: category.id,
          },
        },
        userId,
      },
    })

    const response = await request(app.getHttpServer())
      .put(`/product/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        categoryId: randomUUID(),
      })

    expect(response.status).toBe(404)

    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Category not found',
      }),
    )
  })
})
