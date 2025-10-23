import { createApp } from './app'

const PORT = process.env.PORT || 3000

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

try {
  const app = createApp()

  const server = app.listen(PORT, () => {
    console.log('Shopping Cart API server running on port', PORT)
    console.log('Health check: http://localhost:' + PORT + '/health')
    console.log('API endpoints:')
    console.log('  POST /api/cart/:sessionId/items - Add item to cart')
    console.log('  GET  /api/cart/:sessionId - Get cart')
    console.log('  POST /api/cart/:sessionId/checkout - Checkout cart')
    console.log('  DELETE /api/cart/:sessionId/items/:itemId - Remove item from cart')
  })

  server.on('error', (error: Error) => {
    console.error('Server error:', error)
    process.exit(1)
  })

} catch (error) {
  console.error('Failed to start server:', error)
  process.exit(1)
}
