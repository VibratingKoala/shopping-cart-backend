import { Router } from 'express'
import { createCartController } from '../adapters/controllers/CartController'
import { InMemoryCartRepository } from '../adapters/repositories/InMemoryCartRepository'

export const createRoutes = (): Router => {
  const router = Router()
  const cartRepository = new InMemoryCartRepository()
  const cartController = createCartController(cartRepository)

  // Health check endpoint
  router.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() })
  })

  // Cart endpoints
  router.post('/api/cart/:sessionId/items', cartController.addItem)
  router.get('/api/cart/:sessionId', cartController.getCart)
  router.post('/api/cart/:sessionId/checkout', cartController.checkout)
  router.delete('/api/cart/:sessionId/items/:itemId', cartController.removeItem)

  return router
}
