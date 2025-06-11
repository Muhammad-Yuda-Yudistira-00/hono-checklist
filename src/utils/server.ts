import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { serveStatic } from 'hono/bun'
import { ZodError } from 'zod'
import { logger } from './logging'
import { routes } from '../routes'
import { apiKeyAuth } from '../middleware/api-key.middleware'
import { cors } from 'hono/cors'

const createServer = () => {
  const app = new Hono()

  // Enable CORS
  app.use(cors())

  // Serve static files
  app.use('*', serveStatic({ root: './public' }))

  // use API key if production
  if (process.env.NODE_ENV === 'production') {
    // Middleware API key, kecualikan /auth/generate-api-key
    app.use(apiKeyAuth(['/health', '/api/generate-api-key']) as any)
  }

  // Setup routes
  routes(app)

  // Error handler
  app.onError(async (err, c) => {
    if (err instanceof HTTPException) {
      logger.error(err.message)

      c.status(err.status)
      return c.json({
        status: false,
        statusCode: err.status,
        message: err.message
      })
    } else if (err instanceof ZodError) {
      logger.error(JSON.parse(err.message))

      c.status(400)
      return c.json({
        status: false,
        statusCode: 400,
        message: JSON.parse(err.message)
      })
    } else {
      logger.error(err.message)

      c.status(500)
      return c.json({
        status: false,
        statusCode: 500,
        message: err.message
      })
    }
  })

  return app
}

export default createServer
