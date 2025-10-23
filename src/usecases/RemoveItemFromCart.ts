import { CartRepository } from '../domain/repositories/CartRepository'
import { removeItemFromCart } from '../domain/entities/Cart'
import { createProductId } from '../domain/value-objects/ProductId'

export type RemoveItemFromCartRequest = {
  sessionId: string
  itemId: string
}

export type RemoveItemFromCartResponse = {
  success: boolean
  cart?: import('../domain/entities/Cart').Cart
  error?: string
}

export const createRemoveItemFromCartUseCase = (repository: CartRepository) => {
  return async (request: RemoveItemFromCartRequest): Promise<RemoveItemFromCartResponse> => {
    try {
      // Validate input
      if (!request.sessionId || !request.itemId) {
        return {
          success: false,
          error: 'Session ID and item ID are required'
        }
      }

      // Get cart
      const cart = await repository.findById(request.sessionId)
      if (!cart) {
        return {
          success: false,
          error: 'Cart not found'
        }
      }

      // Check if item exists in cart
      const itemExists = cart.items.some(item => item.productId.value === request.itemId)
      if (!itemExists) {
        return {
          success: false,
          error: 'Item not found in cart'
        }
      }

      // Remove item from cart
      const productId = createProductId(request.itemId)
      const updatedCart = removeItemFromCart(cart, productId)

      // Save cart
      await repository.save(updatedCart)

      return {
        success: true,
        cart: updatedCart
      }

    } catch (error) {
      console.error('Error in RemoveItemFromCart use case:', error)
      return {
        success: false,
        error: 'Failed to remove item from cart'
      }
    }
  }
}
