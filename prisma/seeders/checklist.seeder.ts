import { prisma } from '../../src/utils/prisma'

export async function seedChecklist() {
  console.log('Seeding Checklists...')

  const checklists = [
    {
      code: 'CL-001',
      title: 'Project Setup',
      description: 'Checklist for initial project setup',
      deleted: false
    },
    {
      code: 'CL-002',
      title: 'Daily Tasks',
      description: 'Checklist for daily team activities',
      deleted: false
    },
    {
      code: 'CL-003',
      title: 'Bug Fixing',
      description: 'Checklist for fixing reported bugs',
      deleted: false
    },
    {
      code: 'CL-004',
      title: 'Release Prep',
      description: 'Checklist for preparing a release',
      deleted: true // Example of a deleted checklist
    }
  ]

  for (const checklist of checklists) {
    await prisma.checklist.upsert({
      where: { code: checklist.code },
      update: {},
      create: checklist
    })
  }

  console.log('Checklists Seeded!')
}
