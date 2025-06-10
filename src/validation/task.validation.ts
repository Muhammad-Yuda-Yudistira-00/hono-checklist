import { z, ZodType } from 'zod'

export class TaskValidation {
  static readonly CREATE: ZodType = z.object({
    code: z.string().min(1).max(8),
    title: z.string().min(1).max(300),
    level: z.number().min(1).max(3),
    order: z.number().positive().nullable(),
    type: z
      .string()
      .transform((val) => (val === '' ? undefined : val))
      .optional()
      .pipe(z.enum(['regular', 'daily']).optional())
  })

  static readonly LIST: ZodType = z.object({
    code: z.string().min(1).max(8),
    page: z.number().min(1).positive(),
    per_page: z.number().min(1).max(100).positive()
  })

  static readonly GET: ZodType = z.object({
    code: z.string().min(1).max(8),
    id: z.number().positive()
  })

  static readonly UPDATE: ZodType = z.object({
    code: z.string().min(1).max(8),
    id: z.number().positive(),
    order: z.number().positive().nullable(),
    level: z.number().min(1).max(3).nullable(),
    title: z.string().max(300),
    status: z.string().max(100),
    type: z
      .string()
      .transform((val) => (val === '' ? undefined : val))
      .optional()
      .pipe(z.enum(['regular', 'daily']).optional())
  })

  static readonly REMOVE: ZodType = z.object({
    code: z.string().min(1).max(8),
    id: z.number().positive()
  })
}
