import express from 'express'
import { createCartController } from './CartController'
import { InMemoryCartRepository } from '../repositories/InMemoryCartRepository'

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

  // Initialize dependencies
  const cartRepository = new InMemoryCartRepository()
  const cartController = createCartController(cartRepository)

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // Cart API routes
  app.post('/api/cart/:sessionId/items', cartController.addItem)
  app.get('/api/cart/:sessionId', cartController.getCart)
  app.post('/api/cart/:sessionId/checkout', cartController.checkout)
  app.delete('/api/cart/:sessionId/items/:itemId', cartController.removeItem)

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
