import { seedChecklist } from './checklist.seeder'
import { seedTask } from './task.seeder'
import { prisma } from '../../src/utils/prisma'

async function main() {
  await seedChecklist()
  await seedTask()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
