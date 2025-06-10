import { Status, Task, TaskType } from '@prisma/client'

export type CreateTaskRequest = {
  code: string
  title: string
  level: number
  order: number | null
  type: TaskType | null
}

export type ListTaskRequest = {
  code: string
  page: number
  per_page: number
}

export type GetTaskRequest = {
  code: string
  id: number
}

export type UpdateTaskRequest = {
  code: string
  id: number
  order: number | null
  level: number | null
  title: string
  status: Status
  type: TaskType | null
}

export type RemoveTaskRequest = {
  code: string
  id: number
}

export type TaskResponse = {
  id: number
  order: number
  level: number
  title: string
  status: Status
  type: TaskType
}

export type ListTaskResponse = {
  data: TaskResponse[]
  pagination: {
    currentPage: number
    perPage: number
    totalPages: number
    totalItems: number
  }
  meta: {
    totalInProgress: number
    totalDone: number
  }
}

export function toTaskResponse(task: Task): TaskResponse {
  return {
    id: task.id,
    order: task.order,
    title: task.title,
    status: task.status,
    level: task.level,
    type: task.type
  }
}
