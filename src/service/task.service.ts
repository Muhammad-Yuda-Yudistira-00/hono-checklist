import { Checklist, Task } from '@prisma/client'
import {
  CreateTaskRequest,
  GetTaskRequest,
  ListTaskRequest,
  ListTaskResponse,
  RemoveTaskRequest,
  TaskResponse,
  toTaskResponse,
  UpdateTaskRequest
} from '../model/task.model'
import { prisma } from '../utils/prisma'
import { TaskValidation } from '../validation/task.validation'
import { HTTPException } from 'hono/http-exception'

export class TaskService {
  static async create(request: CreateTaskRequest): Promise<TaskResponse> {
    request = TaskValidation.CREATE.parse(request)

    await this.checklistMustExists(request.code)

    let parent = null
    if (request.parentId) {
      parent = await this.taskMustExists(request.code, request.parentId)

      // max parent level 3
      if (parent.level >= 3) {
        throw new HTTPException(400, {
          message: 'Parent task level must be less than 3'
        })
      }
    }

    // order, where checklist code and parent id

    const order = await prisma.task.count({
      where: {
        checklist: { code: request.code },
        parent_id: parent ? parent.id : null
      }
    })

    const task = await prisma.task.create({
      data: {
        title: request.title,
        order: order + 1,
        status: 'in_progress',
        checklist: { connect: { code: request.code } },
        parent: parent ? { connect: { id: parent.id } } : undefined,
        level: parent ? parent.level + 1 : 1
      }
    })

    if (!task) {
      throw new Error('Create task failed')
    }

    return toTaskResponse(task)
  }

  static async list(request: ListTaskRequest): Promise<ListTaskResponse> {
    request = TaskValidation.LIST.parse(request)

    await this.checklistMustExists(request.code)

    // Ambil tasks yang parent_id NULL (task utama)
    const tasks = await prisma.task.findMany({
      where: {
        checklist: { code: request.code },
        parent_id: null
      },
      orderBy: { order: 'asc' },
      take: request.per_page,
      skip: (request.page - 1) * request.per_page
    })

    const total = await prisma.task.count({
      where: { checklist: { code: request.code } }
    })

    // Rekursif untuk mengambil children
    const tasksWithChildren = await Promise.all(
      tasks.map(async (task) => ({
        id: task.id,
        order: task.order,
        title: task.title,
        status: task.status,
        parentId: task.parent_id,
        children: await this.getTaskWithChildren(task.id) // Ambil children rekursif
      }))
    )

    return {
      data: tasksWithChildren,
      pagination: {
        currentPage: request.page,
        perPage: request.per_page,
        totalPages: Math.ceil(total / request.per_page),
        totalItems: total
      }
    }
  }

  static async get(request: GetTaskRequest): Promise<TaskResponse> {
    request = TaskValidation.GET.parse(request)

    await this.checklistMustExists(request.code)

    const task = await this.taskMustExists(request.code, request.id)

    return toTaskResponse(task)
  }

  static async update(request: UpdateTaskRequest): Promise<TaskResponse> {
    request = TaskValidation.UPDATE.parse(request)

    await this.checklistMustExists(request.code)

    const task = await this.taskMustExists(request.code, request.id)

    if (request.order) {
      const oldTask = task

      if (oldTask.order < request.order) {
        await prisma.task.updateMany({
          where: {
            order: { gt: oldTask.order, lte: request.order },
            parent_id: oldTask.parent_id
          },
          data: {
            order: { decrement: 1 }
          }
        })
      } else if (oldTask.order > request.order) {
        await prisma.task.updateMany({
          where: {
            order: { gte: request.order, lt: oldTask.order },
            parent_id: oldTask.parent_id
          },
          data: {
            order: { increment: 1 }
          }
        })
      }

      await prisma.task.update({
        where: { id: request.id },
        data: { order: request.order }
      })
    }

    if (request.title) {
      task.title = request.title
    }

    if (request.status) {
      if (request.status !== 'in_progress' && request.status !== 'done') {
        throw new HTTPException(400, {
          message: 'Invalid status'
        })
      }

      task.status = request.status
    }

    const updatedTask = await prisma.task.update({
      where: { id: request.id },
      data: {
        title: task.title,
        status: task.status
      }
    })

    return toTaskResponse(updatedTask)
  }

  static async remove(request: RemoveTaskRequest): Promise<Boolean> {
    request = TaskValidation.REMOVE.parse(request)

    await this.checklistMustExists(request.code)

    const task = await this.taskMustExists(request.code, request.id)

    await prisma.task.delete({
      where: { id: request.id }
    })

    const tasks = await prisma.task.findMany({
      orderBy: { order: 'asc' },
      where: {
        checklist: { code: request.code },
        parent_id: task.parent_id
      }
    })

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].order > task.order) {
        await prisma.task.update({
          where: { id: tasks[i].id, parent_id: task.parent_id },
          data: { order: tasks[i].order - 1 }
        })
      }
    }

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

  static async taskMustExists(code: string, id: number): Promise<Task> {
    const task = await prisma.task.findFirst({
      where: {
        id,
        checklist: {
          code: code,
          deleted: false
        }
      }
    })

    if (!task) {
      throw new HTTPException(404, {
        message: 'Task not found'
      })
    }

    return task
  }

  static async getTaskWithChildren(taskId: number): Promise<TaskResponse[]> {
    const children = await prisma.task.findMany({
      where: { parent_id: taskId },
      orderBy: { order: 'asc' }
    })

    return Promise.all(
      children.map(
        async (child): Promise<TaskResponse> => ({
          id: child.id,
          order: child.order,
          title: child.title,
          status: child.status,
          parentId: child.parent_id,
          children: await this.getTaskWithChildren(child.id)
        })
      )
    )
  }
}
