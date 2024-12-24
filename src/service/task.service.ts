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

export class TaskService {
  static async create(request: CreateTaskRequest): Promise<TaskResponse> {
    request = TaskValidation.CREATE.parse(request)

    const task = await prisma.task.create({
      data: {
        title: request.title,
        status: 'in_progress',
        checklist: { connect: { code: request.code } }
      }
    })

    if (!task) {
      throw new Error('Create task failed')
    }

    return toTaskResponse(task)
  }

  static async list(request: ListTaskRequest): Promise<ListTaskResponse> {
    request = TaskValidation.LIST.parse(request)

    const checklist = await prisma.checklist.findFirst({
      where: { code: request.code }
    })

    if (!checklist) {
      throw new Error('Checklist not found')
    }

    const tasks = await prisma.task.findMany({
      take: request.per_page,
      skip: (request.page - 1) * request.per_page,
      where: {
        checklist: { code: request.code }
      }
    })

    const total = await prisma.task.count({
      where: {
        checklist: { code: request.code }
      }
    })

    return {
      data: tasks.map(toTaskResponse),
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

    const checklist = await prisma.checklist.findFirst({
      where: { code: request.code }
    })

    if (!checklist) {
      throw new Error('Checklist not found')
    }

    const task = await prisma.task.findFirst({
      where: { id: request.id }
    })

    if (!task) {
      throw new Error('Task not found')
    }

    return toTaskResponse(task)
  }

  static async update(request: UpdateTaskRequest): Promise<TaskResponse> {
    request = TaskValidation.UPDATE.parse(request)
    // status must in_progress, done

    const checklist = await prisma.checklist.findFirst({
      where: { id: request.id }
    })

    if (!checklist) {
      throw new Error('Checklist not found')
    }

    const task = await prisma.task.findFirst({
      where: { id: request.id }
    })

    if (!task) {
      throw new Error('Task not found')
    }

    if (request.title) {
      task.title = request.title
    }

    if (request.status) {
      if (request.status !== 'in_progress' && request.status !== 'done') {
        throw new Error('Status must be in_progress or done')
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

    const checklist = await prisma.checklist.findFirst({
      where: { code: request.code }
    })

    if (!checklist) {
      throw new Error('Checklist not found')
    }

    const task = await prisma.task.findFirst({
      where: { id: request.id }
    })

    if (!task) {
      throw new Error('Task not found')
    }

    await prisma.task.delete({
      where: { id: request.id }
    })

    return true
  }
}
