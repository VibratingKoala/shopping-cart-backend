import { Request, Response } from 'express'
import { InMemoryCartRepository } from '../repositories/InMemoryCartRepository'
import { createAddItemToCartUseCase } from '../../application/use-cases/AddItemToCart'
import { createGetCartUseCase } from '../../application/use-cases/GetCart'
import { createCheckoutCartUseCase } from '../../application/use-cases/CheckoutCart'
import { createRemoveItemFromCartUseCase } from '../../application/use-cases/RemoveItemFromCart'

// HTTP Status constants
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const

export interface CartController {
  addItem(_req: Request, _res: Response): Promise<void>
  getCart(_req: Request, _res: Response): Promise<void>
  checkout(_req: Request, _res: Response): Promise<void>
  removeItem(_req: Request, _res: Response): Promise<void>
}

// Helper function to handle common error responses
const handleError = (res: Response, error: string, isNotFound = false): void => {
  const status = isNotFound ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.BAD_REQUEST
  res.status(status).json({ error })
}

// Helper function to handle server errors
const handleServerError = (res: Response, error: unknown, operation: string): void => {
  console.error(`Error in ${operation}:`, error)
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: 'Internal server error'
  })
}

// Validation helper for add item request
const validateAddItemRequest = (body: unknown): string | null => {
  if (!body || typeof body !== 'object') {
    return 'Request body must be an object'
  }

  const { productId, quantity, unitPrice } = body as Record<string, unknown>

  if (!productId || !quantity || !unitPrice) {
    return 'Missing required fields: productId, quantity, unitPrice'
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    return 'Quantity must be a positive number'
  }

  if (typeof unitPrice !== 'object' || !unitPrice ||
      !('amount' in unitPrice) || !('currency' in unitPrice)) {
    return 'Unit price must be an object with amount and currency'
  }

  const priceObj = unitPrice as { amount: unknown; currency: unknown }
  if (typeof priceObj.amount !== 'number' || priceObj.amount <= 0) {
    return 'Unit price amount must be a positive number'
  }

  return null
}

export const createCartController = (repository: InMemoryCartRepository): CartController => {
  const addItemUseCase = createAddItemToCartUseCase(repository)
  const getCartUseCase = createGetCartUseCase(repository)
  const checkoutUseCase = createCheckoutCartUseCase(repository)
  const removeItemUseCase = createRemoveItemFromCartUseCase(repository)

  return {
    async addItem(req: Request, res: Response): Promise<void> {
      try {
        const { sessionId } = req.params
        const validationError = validateAddItemRequest(req.body)

        if (validationError) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({ error: validationError })
          return
        }

        const { productId, quantity, unitPrice } = req.body
        const result = await addItemUseCase({
          cartId: sessionId,
          productId,
          quantity,
          unitPrice: unitPrice.amount,
          currency: unitPrice.currency
        })

        if (result.success) {
          res.status(HTTP_STATUS.OK).json({
            message: 'Item added successfully',
            cart: result.cart
          })
        } else {
          handleError(res, result.error || 'Unknown error')
        }
      } catch (error) {
        handleServerError(res, error, 'addItem')
      }
    },

    async getCart(req: Request, res: Response): Promise<void> {
      try {
        const { sessionId } = req.params
        const result = await getCartUseCase({ cartId: sessionId })

        if (result.success) {
          res.status(HTTP_STATUS.OK).json(result.cart)
          return
        }

        const isNotFound = result.error === 'Cart not found'
        handleError(res, result.error || 'Unknown error', isNotFound)
      } catch (error) {
        handleServerError(res, error, 'getCart')
      }
    },

    async checkout(req: Request, res: Response): Promise<void> {
      try {
        const { sessionId } = req.params
        const result = await checkoutUseCase({ cartId: sessionId })

        if (result.success) {
          res.status(HTTP_STATUS.OK).json({
            orderId: result.orderId,
            total: result.total,
            items: result.items
          })
          return
        }

        const isNotFound = result.error === 'Cart not found'
        handleError(res, result.error || 'Unknown error', isNotFound)
      } catch (error) {
        handleServerError(res, error, 'checkout')
      }
    },

    async removeItem(req: Request, res: Response): Promise<void> {
      try {
        const { sessionId, itemId } = req.params

        if (!sessionId || !itemId) {
          res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: 'Session ID and item ID are required'
          })
          return
        }

        const result = await removeItemUseCase({
          sessionId,
          itemId
        })

        if (result.success) {
          res.status(HTTP_STATUS.OK).json({
            message: 'Item removed successfully',
            cart: result.cart
          })
          return
        }

        const isNotFound = result.error === 'Cart not found' || result.error === 'Item not found in cart'
        handleError(res, result.error || 'Unknown error', isNotFound)
      } catch (error) {
        handleServerError(res, error, 'removeItem')
      }
    }
  }
}
