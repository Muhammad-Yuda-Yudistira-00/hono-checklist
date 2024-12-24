import createServer from './utils/server'

const app = createServer()

export default {
  port: process.env.PORT ?? 3000,
  fetch: app.fetch,
  request: app.request,
  error(err: Error) {
    console.error(err)
    return new Response('Internal Server Error', { status: 500 })
  }
}

console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`)
