import { Hono } from 'hono'
import { response } from '../utils/response'
import { ChecklistService } from '../service/checklist.service'
import { ListChecklistRequest, UpdateChecklistRequest } from '../model/checklist.model'

export const checklistController = new Hono()

checklistController.get('/checklist/expire', async (c) => {
  const checklistResponse = await ChecklistService.updateExpiredAt()

  return response(c, 200, 'Update checklist expired_at success', checklistResponse)
})

checklistController.post('/checklist', async (c) => {
  const checklistResponse = await ChecklistService.create()

  return response(c, 201, 'Create checklist success', checklistResponse)
})

checklistController.get('/checklist', async (c) => {
  const request: ListChecklistRequest = {
    page: Number(c.req.query('page')) || 1,
    per_page: Number(c.req.query('per_page')) || 10
  }

  const checklistResponse = await ChecklistService.list(request)

  return response(c, 200, 'List checklist success', checklistResponse)
})

checklistController.get('/checklist/:code', async (c) => {
  const code = String(c.req.param('code'))

  const checklistResponse = await ChecklistService.get(code)

  return response(c, 200, 'Get checklist success', checklistResponse)
})

checklistController.patch('/checklist/:code', async (c) => {
  const code = String(c.req.param('code'))

  const formData = await c.req.formData()

  const request: UpdateChecklistRequest = {
    code: code,
    title: formData.get('title')?.toString() || '',
    description: formData.get('description')?.toString() || ''
  }

  const checklistResponse = await ChecklistService.update(request)

  return response(c, 200, 'Update checklist success', checklistResponse)
})

checklistController.delete('/checklist/:code', async (c) => {
  const code = String(c.req.param('code'))

  const checklistResponse = await ChecklistService.remove(code)

  return response(c, 200, 'Remove checklist success', checklistResponse)
})
