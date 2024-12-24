import { Hono } from 'hono'
import { response } from '../utils/response'
import { ChecklistService } from '../service/checklist.service'
import { ListChecklistRequest, UpdateChecklistRequest } from '../model/checklist.model'

export const checklistController = new Hono()

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

checklistController.get('/checklist/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const checklistResponse = await ChecklistService.get(id)

  return response(c, 200, 'Get checklist success', checklistResponse)
})

checklistController.patch('/checklist/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const formData = await c.req.formData()

  const request: UpdateChecklistRequest = {
    id: id,
    title: formData.get('title')?.toString() || '',
    description: formData.get('description')?.toString() || ''
  }

  const checklistResponse = await ChecklistService.update(request)

  return response(c, 200, 'Update checklist success', checklistResponse)
})

checklistController.delete('/checklist/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const checklistResponse = await ChecklistService.remove(id)

  return response(c, 200, 'Remove checklist success', checklistResponse)
})
