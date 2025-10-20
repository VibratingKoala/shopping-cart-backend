import { Cart, createCart, addItemToCart, createCartItem } from '../../domain/entities/Cart'
import { createProductId } from '../../domain/value-objects/ProductId'
import { createMoney } from '../../domain/value-objects/Money'
import { CartRepository } from '../ports/CartRepository'

export type AddItemToCartRequest = {
  cartId: string
  productId: string
  quantity: number
  unitPrice: number
  currency?: string
}

export type AddItemToCartResponse = {
  success: boolean
  cart?: Cart
  error?: string
}

export const createAddItemToCartUseCase = (cartRepository: CartRepository) => {
  return async (request: AddItemToCartRequest): Promise<AddItemToCartResponse> => {
    try {
      // Validate input
      if (!request.cartId || !request.productId || request.quantity <= 0 || request.unitPrice <= 0) {
        return {
          success: false,
          error: 'Invalid request parameters'
        }
      }

      // Get or create cart
      let cart = await cartRepository.findById(request.cartId)
      if (!cart) {
        cart = createCart(request.cartId)
      }

      // Create cart item
      const productId = createProductId(request.productId)
      const unitPrice = createMoney(request.unitPrice, request.currency || 'USD')
      const cartItem = createCartItem(productId, request.quantity, unitPrice)

      // Add item to cart
      const updatedCart = addItemToCart(cart, cartItem)

      // Save cart
      await cartRepository.save(updatedCart)

      return {
        success: true,
        cart: updatedCart
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}