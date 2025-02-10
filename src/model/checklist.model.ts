import { Checklist } from '@prisma/client'

export type ListChecklistRequest = {
  page: number
  per_page: number
}

export type UpdateChecklistRequest = {
  code: string
  title: string | null
  description: string | null
  expiredAt: string | null
}

export type ChecklistResponse = {
  id: number
  code: string
  title: string
  description: string | null
  createdAt: Date
  expiredAt: Date
}

export type ListChecklistResponse = {
  data: ChecklistResponse[]
  pagination: {
    currentPage: number
    perPage: number
    totalPages: number
    totalItems: number
  }
}

export function toChecklistResponse(checklist: Checklist): ChecklistResponse {
  return {
    id: checklist.id,
    code: checklist.code,
    title: checklist.title,
    description: checklist.description,
    createdAt: checklist.created_at,
    expiredAt: checklist.expired_at
  }
}
