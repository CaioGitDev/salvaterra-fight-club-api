/* eslint-disable @typescript-eslint/no-var-requires */
const frequencies = ['3x Semana', '5x Semana']

const genders = ['Masculino', 'Feminino', 'Outro']

const identificationsTypes = [
  'Cartão de Cidadão',
  'Autorização de Residência',
  'Bilhete de Identidade',
  'Passaporte',
]

const memberTypes = [
  'Normal',
  'Fámilia',
  'Estudante',
  'Administração',
  'Professor',
]

const modalities = ['Muay Thai', 'Jiu Jitsu', 'Muay Thai + Jiu Jitsu']

const nacionalities = [
  'Português',
  'Brasileiro',
  'Ucraniano',
  'Espanhol',
  'Francês',
  'Inglês',
  'Alemão',
  'Italiano',
  'Russo',
  'Chinês',
  'Japonês',
  'Marroquino',
  'Paquistanês',
  'Indiano',
]

const paymentMethods = ['Multibanco', 'Transferência Bancária', 'MBWay']

const paymentFrequencies = ['Mensal', 'Trimestral', 'Semestral', 'Anual']

const paymentStatus = ['Pago', 'Em Dívida', 'Isento']

const paymentTypes = ['Inscrição', 'Mensalidade', 'Quota']

const relationshipDegrees = [
  'Pai',
  'Mãe',
  'Irmão',
  'Irmã',
  'Avó',
  'Avô',
  'Tio',
  'Tia',
]

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const load = async () => {
  try {
    const frequenciesArr = []
    frequencies.forEach((frequency) => {
      frequenciesArr.push({
        name: frequency,
        description: 'Número de vezes que o membro treina por semana',
      })
    })

    await prisma.frequency.createMany({
      data: frequenciesArr,
    })

    const gendersArr = []
    genders.forEach((gender) => {
      gendersArr.push({
        name: gender,
        description: 'Géneros',
      })
    })

    await prisma.gender.createMany({
      data: gendersArr,
    })

    const identificationTypesArr = []
    identificationsTypes.forEach((identificationType) => {
      identificationTypesArr.push({
        name: identificationType,
        description: 'Lista de tipos de documentos de identificação',
      })
    })
    await prisma.identityDocumentType.createMany({
      data: identificationTypesArr,
    })

    const memberTypesArr = []
    memberTypes.forEach((memberType) => {
      memberTypesArr.push({
        name: memberType,
        description: 'Tipos de incrições',
      })
    })
    await prisma.memberType.createMany({
      data: memberTypesArr,
    })

    const modalitiesArr = []
    modalities.forEach((modality) => {
      modalitiesArr.push({
        name: modality,
        description: 'Lista de modalidades',
      })
    })
    await prisma.modality.createMany({
      data: modalitiesArr,
    })

    const nacionalitiesArr = []
    nacionalities.forEach((nacionality) => {
      nacionalitiesArr.push({
        name: nacionality,
        description: 'Lista de países mais comuns em Portugal',
      })
    })
    await prisma.nationality.createMany({
      data: nacionalitiesArr,
    })

    const paymentsFrequencyArr = []
    paymentFrequencies.forEach((frequency) => {
      paymentsFrequencyArr.push({
        name: frequency,
        description: 'Frequência de pagamento',
      })
    })
    await prisma.paymentFrequency.createMany({
      data: paymentsFrequencyArr,
    })

    const relationshipDegreesArr = []
    relationshipDegrees.forEach((relationshipDegree) => {
      relationshipDegreesArr.push({
        name: relationshipDegree,
        description: 'Grau de parentesco',
      })
    })
    await prisma.relationshipDegree.createMany({
      data: relationshipDegreesArr,
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}
load()
