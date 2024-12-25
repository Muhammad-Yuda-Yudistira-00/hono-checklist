import {
  ChecklistResponse,
  ListChecklistRequest,
  ListChecklistResponse,
  toChecklistResponse,
  UpdateChecklistRequest
} from '../model/checklist.model'
import { prisma } from '../utils/prisma'
import { randomBytes } from 'crypto'
import { checklistValidation } from '../validation/checklist.validation'
import { Checklist } from '@prisma/client'
import { HTTPException } from 'hono/http-exception'

export class ChecklistService {
  static async create(): Promise<ChecklistResponse> {
    const code = randomBytes(4).toString('hex')

    const checklist = await prisma.checklist.create({
      data: {
        code,
        title: 'Untitled'
      }
    })

    if (!checklist) {
      return this.create()
    }

    return toChecklistResponse(checklist)
  }

  static async list(request: ListChecklistRequest): Promise<ListChecklistResponse> {
    request = checklistValidation.LIST.parse(request)

    const checklists = await prisma.checklist.findMany({
      where: {
        deleted: false
      },
      take: request.per_page,
      skip: (request.page - 1) * request.per_page
    })

    const total = await prisma.checklist.count({
      where: {
        deleted: false
      }
    })

    return {
      data: checklists.map(toChecklistResponse),
      pagination: {
        currentPage: request.page,
        perPage: request.per_page,
        totalPages: Math.ceil(total / request.per_page),
        totalItems: total
      }
    }
  }

  static async get(id: number): Promise<ChecklistResponse> {
    id = checklistValidation.GET.parse(id)

    const checklist = await this.checklistMustExists(id)

    return toChecklistResponse(checklist)
  }

  static async update(request: UpdateChecklistRequest): Promise<ChecklistResponse> {
    request = checklistValidation.UPDATE.parse(request)

    const checklist = await this.checklistMustExists(request.id)

    if (request.title) {
      checklist.title = request.title
    }

    if (request.description) {
      checklist.description = request.description
    }

    const updatedChecklist = await prisma.checklist.update({
      where: { id: checklist.id, deleted: false },
      data: {
        title: checklist.title,
        description: checklist.description
      }
    })

    return toChecklistResponse(updatedChecklist)
  }

  static async remove(id: number): Promise<Boolean> {
    id = checklistValidation.REMOVE.parse(id)

    await this.checklistMustExists(id)

    await prisma.checklist.delete({
      where: { id }
    })

    return true
  }

  static async checklistMustExists(id: number): Promise<Checklist> {
    const checklist = await prisma.checklist.findFirst({
      where: { id, deleted: false }
    })

    if (!checklist) {
      throw new HTTPException(404, {
        message: 'Checklist not found'
      })
    }

    return checklist
  }
}
