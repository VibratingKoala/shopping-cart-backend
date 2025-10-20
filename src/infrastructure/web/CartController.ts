import { Request, Response } from 'express'
import { InMemoryCartRepository } from '../repositories/InMemoryCartRepository'
import { createAddItemToCartUseCase } from '../../application/use-cases/AddItemToCart'
import { createGetCartUseCase } from '../../application/use-cases/GetCart'
import { createCheckoutCartUseCase } from '../../application/use-cases/CheckoutCart'

export interface CartController {
  addItem(req: Request, res: Response): Promise<void>
  getCart(req: Request, res: Response): Promise<void>
  checkout(req: Request, res: Response): Promise<void>
}

export const createCartController = (repository: InMemoryCartRepository): CartController => {
  const addItemUseCase = createAddItemToCartUseCase(repository)
  const getCartUseCase = createGetCartUseCase(repository)
  const checkoutUseCase = createCheckoutCartUseCase(repository)

  return {
    async addItem(req: Request, res: Response): Promise<void> {
      try {
        const { cartId } = req.params
        const { productId, quantity, unitPrice } = req.body

        // Basic validation
        if (!productId || !quantity || !unitPrice) {
          res.status(400).json({
            error: 'Missing required fields: productId, quantity, unitPrice'
          })
          return
        }

        if (typeof quantity !== 'number' || quantity <= 0) {
          res.status(400).json({
            error: 'Quantity must be a positive number'
          })
          return
        }

        // Handle unitPrice as object { amount, currency }
        if (typeof unitPrice !== 'object' || !unitPrice.amount || !unitPrice.currency) {
          res.status(400).json({
            error: 'Unit price must be an object with amount and currency'
          })
          return
        }

        if (typeof unitPrice.amount !== 'number' || unitPrice.amount <= 0) {
          res.status(400).json({
            error: 'Unit price amount must be a positive number'
          })
          return
        }

        const result = await addItemUseCase({
          cartId,
          productId,
          quantity,
          unitPrice: unitPrice.amount,
          currency: unitPrice.currency
        })

        if (result.success) {
          res.status(200).json({
            message: 'Item added successfully',
            cart: result.cart
          })
        } else {
          res.status(400).json({
            error: result.error
          })
        }
      } catch (error) {
        console.error('Error in addItem:', error)
        res.status(500).json({
          error: 'Internal server error'
        })
      }
    },

    async getCart(req: Request, res: Response): Promise<void> {
      try {
        const { cartId } = req.params

        const result = await getCartUseCase({ cartId })

        if (result.success) {
          // Return cart data directly instead of wrapped in cart property
          res.status(200).json(result.cart)
        } else {
          if (result.error === 'Cart not found') {
            res.status(404).json({
              error: result.error
            })
          } else {
            res.status(400).json({
              error: result.error
            })
          }
        }
      } catch (error) {
        console.error('Error in getCart:', error)
        res.status(500).json({
          error: 'Internal server error'
        })
      }
    },

    async checkout(req: Request, res: Response): Promise<void> {
      try {
        const { cartId } = req.params

        const result = await checkoutUseCase({ cartId })

        if (result.success) {
          res.status(200).json({
            orderId: result.orderId,
            total: result.total,
            items: result.items
          })
        } else {
          if (result.error === 'Cart not found') {
            res.status(404).json({
              error: result.error
            })
          } else {
            res.status(400).json({
              error: result.error
            })
          }
        }
      } catch (error) {
        console.error('Error in checkout:', error)
        res.status(500).json({
          error: 'Internal server error'
        })
      }
    }
  }
}