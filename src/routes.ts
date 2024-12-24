import { Hono } from 'hono'
import { prisma } from './utils/prisma'
import { checklistController } from './controller/checklist.controller'
import { taskController } from './controller/task.controller'

export const routes = (app: Hono) => {
  app.get('/health', async (c) => {
    try {
      await prisma.$connect()
      return c.json({
        status: true,
        statusCode: 200,
        message: 'OK'
      })
    } catch (err) {
      throw new Error(err as string)
    }
  })

  app.route('/api', checklistController)
  app.route('/api', taskController)
}
