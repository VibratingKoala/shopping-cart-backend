import { describe, it, expect, beforeEach } from 'vitest'
import { createRemoveItemFromCartUseCase } from './RemoveItemFromCart'
import { createAddItemToCartUseCase } from './AddItemToCart'
import { CartRepository } from '../domain/repositories/CartRepository'
import { Cart, createCart } from '../domain/entities/Cart'

// Mock repository for testing
class MockCartRepository implements CartRepository {
  private readonly carts = new Map<string, Cart>()

  async save(cart: Cart): Promise<void> {
    this.carts.set(cart.id, cart)
  }

  async findById(id: string): Promise<Cart | null> {
    return this.carts.get(id) || null
  }

  async delete(id: string): Promise<void> {
    this.carts.delete(id)
  }

  clear() {
    this.carts.clear()
  }
}

describe('RemoveItemFromCart Use Case', () => {
  let repository: MockCartRepository
  let removeItemUseCase: ReturnType<typeof createRemoveItemFromCartUseCase>
  let addItemUseCase: ReturnType<typeof createAddItemToCartUseCase>

  beforeEach(() => {
    repository = new MockCartRepository()
    removeItemUseCase = createRemoveItemFromCartUseCase(repository)
    addItemUseCase = createAddItemToCartUseCase(repository)
  })

  it('removes item from cart successfully', async () => {
    // First add an item to cart
    await addItemUseCase({
      cartId: 'session-1',
      productId: 'product-1',
      quantity: 2,
      unitPrice: 10.99
    })

    // Then remove it
    const result = await removeItemUseCase({
      sessionId: 'session-1',
      itemId: 'product-1'
    })

    expect(result.success).toBe(true)
    expect(result.cart).toBeDefined()
    expect(result.cart!.items).toHaveLength(0)
  })

  it('removes one item from cart with multiple items', async () => {
    // Add multiple items
    await addItemUseCase({
      cartId: 'session-1',
      productId: 'product-1',
      quantity: 1,
      unitPrice: 10.99
    })

    await addItemUseCase({
      cartId: 'session-1',
      productId: 'product-2',
      quantity: 2,
      unitPrice: 5.99
    })

    // Remove one item
    const result = await removeItemUseCase({
      sessionId: 'session-1',
      itemId: 'product-1'
    })

    expect(result.success).toBe(true)
    expect(result.cart!.items).toHaveLength(1)
    expect(result.cart!.items[0].productId.value).toBe('product-2')
  })

  it('returns error for non-existent cart', async () => {
    const result = await removeItemUseCase({
      sessionId: 'non-existent',
      itemId: 'product-1'
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Cart not found')
  })

  it('returns error for non-existent item', async () => {
    // Create empty cart
    const cart = createCart('session-1')
    await repository.save(cart)

    const result = await removeItemUseCase({
      sessionId: 'session-1',
      itemId: 'non-existent-product'
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Item not found in cart')
  })

  it('handles empty session ID', async () => {
    const result = await removeItemUseCase({
      sessionId: '',
      itemId: 'product-1'
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Session ID and item ID are required')
  })

  it('handles empty item ID', async () => {
    const result = await removeItemUseCase({
      sessionId: 'session-1',
      itemId: ''
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Session ID and item ID are required')
  })
})
