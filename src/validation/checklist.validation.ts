import { z, ZodType } from 'zod'

export class checklistValidation {
  static readonly LIST: ZodType = z.object({
    page: z.number().min(1).positive(),
    per_page: z.number().min(1).max(100).positive()
  })

  static readonly GET: ZodType = z.string()

  static readonly UPDATE: ZodType = z.object({
    code: z.string(),
    title: z.string().max(100),
    description: z.string().max(100),
    expiredAt: z.string().max(100)
  })

  static readonly REMOVE: ZodType = z.string()
}
