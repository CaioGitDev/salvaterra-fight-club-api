import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Put member address (E2E)', () => {
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

  test('[GET] /member/address', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test',
        email: 'test@gmail.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.member.create({
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
      .get('/members')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      members: [expect.objectContaining({ fullName: 'medir amdar' })],
    })

    const member = response.body.members[0]

    const response2 = await request(app.getHttpServer())
      .put('/member/address')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        memberId: member.id,
        address: 'Rua das Flores updated',
        city: 'Porto updated',
        county: 'Porto updated',
        postalCode: '4000-000',
      })

    expect(response2.status).toBe(200)

    expect(response2.body).toEqual(
      expect.objectContaining({
        address: 'Rua das Flores updated',
        city: 'Porto updated',
        county: 'Porto updated',
        postalCode: '4000-000',
      }),
    )
  })
})