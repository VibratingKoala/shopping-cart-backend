import express from 'express'
import { createRoutes } from './routes'

export const createApp = () => {
  const app = express()

  // Middleware
  app.use(express.json())

  // CORS headers for development
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    } else {
      next()
    }
  })

  // Routes
  app.use(createRoutes())

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err)
    res.status(500).json({
      error: 'Internal server error'
    })
  })

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Endpoint not found'
    })
  })

  return app
}
