import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create member (E2E)', () => {
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

  test('[POST] /members', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test',
        email: 'test@gmail.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/members')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        fullName: 'medir amdar',
        genderId: 1,
        dateOfBirth: '2015-01-01T00:00:00',
        nationalityId: 1,
        placeOfBirth: 'Porto',
        contact: '912345678',
        email: 'ma@hotmail.com',
        modalityId: 1,
        frequencyId: 1,
        memberTypeId: 1,
        paymentFrequencyId: 1,
        termsAndConditions: true,
        healthDeclaration: true,
        createdBy: user.id,
        IdentityDocument: {
          identityDocumentTypeId: 1,
          identificationNumber: '123456789',
          expireDate: '2020-01-01T00:00:00',
          taxIdentificationNumber: '111111111',
        },
        Address: {
          address: 'Rua das Flores',
          city: 'Porto',
          county: 'Porto',
          parish: 'Porto',
          postalCode: '4000-000',
        },
        Guardian: {
          fullName: 'Jane Doe',
          relationshipDegreeId: 1,
          contact: '912345678',
          address: 'Rua das Flores',
          city: 'Porto',
          county: 'Porto',
          parish: 'Porto',
          postalCode: '4000-000',
        },
      })

    expect(response.status).toBe(201)

    const memberOnDatabase = await prisma.member.findUnique({
      where: {
        email: 'ma@hotmail.com',
      },
    })

    expect(memberOnDatabase).toBeTruthy()
  })
})
