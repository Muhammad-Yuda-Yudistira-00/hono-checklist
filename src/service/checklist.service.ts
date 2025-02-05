import {
  ChecklistResponse,
  ListChecklistRequest,
  ListChecklistResponse,
  toChecklistResponse,
  UpdateChecklistRequest
} from '../model/checklist.model'
import { prisma } from '../utils/prisma'
import { nanoid } from 'nanoid'
import { checklistValidation } from '../validation/checklist.validation'
import { Checklist } from '@prisma/client'
import { HTTPException } from 'hono/http-exception'

export class ChecklistService {
  static async create(): Promise<ChecklistResponse> {
    const code = nanoid(8)

    const checklist = await prisma.checklist.create({
      data: {
        code,
        title: 'Untitled',
        expired_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
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
      take: request.per_page,
      skip: (request.page - 1) * request.per_page,
      where: {
        deleted: false,
        expired_at: {
          gte: new Date()
        }
      }
    })

    const total = await prisma.checklist.count({
      where: {
        deleted: false,
        expired_at: {
          gte: new Date()
        }
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

  static async get(code: string): Promise<ChecklistResponse> {
    code = checklistValidation.GET.parse(code)

    const checklist = await this.checklistMustExists(code)

    return toChecklistResponse(checklist)
  }

  static async update(request: UpdateChecklistRequest): Promise<ChecklistResponse> {
    request = checklistValidation.UPDATE.parse(request)

    const checklist = await this.checklistMustExists(request.code)

    if (request.title) {
      checklist.title = request.title
    }

    if (request.description) {
      checklist.description = request.description
    }

    const updatedChecklist = await prisma.checklist.update({
      where: { code: request.code, deleted: false },
      data: {
        title: checklist.title,
        description: checklist.description
      }
    })

    return toChecklistResponse(updatedChecklist)
  }

  static async remove(code: string): Promise<Boolean> {
    code = checklistValidation.REMOVE.parse(code)

    await this.checklistMustExists(code)

    await prisma.checklist.update({
      where: { code },
      data: {
        deleted: true
      }
    })

    return true
  }

  static async checklistMustExists(code: string): Promise<Checklist> {
    const checklist = await prisma.checklist.findFirst({
      where: { code, deleted: false, expired_at: { gte: new Date() } }
    })

    if (!checklist) {
      throw new HTTPException(404, {
        message: 'Checklist not found'
      })
    }

    return checklist
  }
}
