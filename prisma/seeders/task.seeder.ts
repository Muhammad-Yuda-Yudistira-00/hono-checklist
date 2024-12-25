import { prisma } from '../../src/utils/prisma'

export async function seedTask() {
  console.log('Seeding Tasks...')

  const tasks = [
    {
      checklist_id: 1,
      title: 'Initialize repository',
      status: 'in_progress'
    },
    {
      checklist_id: 1,
      title: 'Set up CI/CD pipeline',
      status: 'done'
    },
    {
      checklist_id: 5,
      title: 'Team standup meeting',
      status: 'done'
    },
    {
      checklist_id: 5,
      title: 'Update Jira tickets',
      status: 'in_progress'
    },
    {
      checklist_id: 3,
      title: 'Fix login issue',
      status: 'done'
    },
    {
      checklist_id: 3,
      title: 'Resolve UI alignment bugs',
      status: 'in_progress'
    },
    {
      checklist_id: 4,
      title: 'Finalize release notes',
      status: 'in_progress'
    },
    {
      checklist_id: 4,
      title: 'Update deployment documentation',
      status: 'done'
    }
  ]

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        checklist_id: task.checklist_id,
        title: task.title,
        status: task.status as 'in_progress' | 'done'
      }
    })
  }

  console.log('Tasks Seeded!')
}
