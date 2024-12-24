import { HTTPException } from 'hono/http-exception'
import { prisma } from '../utils/prisma'

// Middleware untuk validasi API key dengan pengecualian path tertentu
export const apiKeyAuth = (excludedPaths: string[] = []) => {
  return async (
    c: {
      req: any
      status: (arg0: number) => void
    },
    next: () => void
  ) => {
    const req = c.req

    const isExcludedPath = excludedPaths.some((path) => req.path.startsWith(path))

    if (isExcludedPath) {
      return next()
    }

    const apiKey = req.header('x-api-key')

    if (!apiKey) {
      throw new HTTPException(401, { message: 'Missing API key' })
    }

    const isValid = await prisma.apiKeys.findUnique({
      where: {
        api_key: apiKey
      }
    })

    if (!isValid) {
      throw new HTTPException(401, { message: 'Invalid API key' })
    }

    return next()
  }
}
