import { createApp } from './infrastructure/web/app'

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
    console.log(`Shopping Cart API server running on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/health`)
    console.log('API endpoints:')
    console.log('  POST /api/carts/:cartId/items - Add item to cart')
    console.log('  GET  /api/carts/:cartId - Get cart')
    console.log('  POST /api/carts/:cartId/checkout - Checkout cart')
  })

  server.on('error', (error) => {
    console.error('Server error:', error)
    process.exit(1)
  })

} catch (error) {
  console.error('Failed to start server:', error)
  process.exit(1)
}