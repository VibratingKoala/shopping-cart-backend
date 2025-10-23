import { Cart } from '../domain/entities/Cart'
import { CartRepository } from '../domain/repositories/CartRepository'

export type GetCartRequest = {
  cartId: string
}

export type GetCartResponse = {
  success: boolean
  cart?: Cart
  error?: string
}

export const createGetCartUseCase = (cartRepository: CartRepository) => {
  return async (request: GetCartRequest): Promise<GetCartResponse> => {
    try {
      if (!request.cartId || request.cartId.trim().length === 0) {
        return {
          success: false,
          error: 'Cart ID is required'
        }
      }

      let cart = await cartRepository.findById(request.cartId)

      if (!cart) {
        // Create an empty cart if it doesn't exist
        const { createCart } = await import('../domain/entities/Cart')
        cart = createCart(request.cartId)
        await cartRepository.save(cart)
      }

      return {
        success: true,
        cart
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}
