import { calculateCartTotal, isCartEmpty } from '../domain/entities/Cart'
import { CartRepository } from '../domain/repositories/CartRepository'

export type CheckoutCartRequest = {
  cartId: string
}

export type CheckoutCartResponse = {
  success: boolean
  orderId?: string
  total?: {
    amount: number
    currency: string
  }
  items?: Array<{
    productId: string
    quantity: number
    unitPrice: {
      amount: number
      currency: string
    }
  }>
  itemCount?: number
  error?: string
}

export const createCheckoutCartUseCase = (cartRepository: CartRepository) => {
  return async (request: CheckoutCartRequest): Promise<CheckoutCartResponse> => {
    try {
      if (!request.cartId || request.cartId.trim().length === 0) {
        return {
          success: false,
          error: 'Cart ID is required'
        }
      }

      const cart = await cartRepository.findById(request.cartId)

      if (!cart) {
        return {
          success: false,
          error: 'Cart not found'
        }
      }

      if (isCartEmpty(cart)) {
        return {
          success: false,
          error: 'Cannot checkout empty cart'
        }
      }

      const total = calculateCartTotal(cart)
      const itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0)

      // Generate a simple order ID
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

      // Copy items before deleting cart
      const items = cart.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: {
          amount: item.unitPrice.amount,
          currency: item.unitPrice.currency
        }
      }))

      // In production, this would:
      // - Process payment
      // - Create order record
      // - Update inventory
      // - Send confirmation email
      // - Clear/archive the cart

      // For demo purposes, we delete the cart to simulate checkout completion
      await cartRepository.delete(request.cartId)

      return {
        success: true,
        orderId,
        total: {
          amount: total.amount,
          currency: total.currency
        },
        items,
        itemCount
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}
