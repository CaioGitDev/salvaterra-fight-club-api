import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Get member guardian (E2E)', () => {
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

  test('[GET] /member/:id/guardian', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test',
        email: 'test@gmail.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const newMember = await prisma.member.create({
      data: {
        fullName: 'medir amdar',
        genderId: 1,
        dateOfBirth: new Date(),
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
          create: {
            identityDocumentTypeId: 1,
            identificationNumber: '123456789',
            expireDate: new Date(),
            taxIdentificationNumber: '111111111',
          },
        },
        Address: {
          create: {
            address: 'Rua das Flores',
            city: 'Porto',
            county: 'Porto',
            parish: 'Porto',
            postalCode: '4000-000',
          },
        },
        Guardian: {
          create: {
            fullName: 'Jane Doe',
            relationshipDegreeId: 1,
            contact: '912345678',
            address: 'Rua das Flores',
            city: 'Porto',
            county: 'Porto',
            parish: 'Porto',
            postalCode: '4000-000',
          },
        },
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/member/${newMember.id}/guardian`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      guardian: expect.objectContaining({
        fullName: 'Jane Doe',
        relationshipDegreeId: 1,
        contact: '912345678',
        address: 'Rua das Flores',
        city: 'Porto',
        county: 'Porto',
        parish: 'Porto',
        postalCode: '4000-000',
      }),
    })
  })
})
