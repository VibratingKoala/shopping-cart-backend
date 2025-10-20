import { describe, it, expect, beforeEach } from 'vitest'
import { createAddItemToCartUseCase } from './AddItemToCart'
import { createGetCartUseCase } from './GetCart'
import { createCheckoutCartUseCase } from './CheckoutCart'
import { CartRepository } from '../ports/CartRepository'
import { Cart, createCart } from '../../domain/entities/Cart'

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

describe('AddItemToCart Use Case', () => {
  let repository: MockCartRepository
  let useCase: ReturnType<typeof createAddItemToCartUseCase>

  beforeEach(() => {
    repository = new MockCartRepository()
    useCase = createAddItemToCartUseCase(repository)
  })

  it('adds item to new cart', async () => {
    const result = await useCase({
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 2,
      unitPrice: 10.99
    })

    expect(result.success).toBe(true)
    expect(result.cart).toBeDefined()
    expect(result.cart!.items).toHaveLength(1)
    expect(result.cart!.items[0].quantity).toBe(2)
  })

  it('adds item to existing cart', async () => {
    // First add an item
    await useCase({
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 1,
      unitPrice: 10.99
    })

    // Add another item
    const result = await useCase({
      cartId: 'cart-1',
      productId: 'product-2',
      quantity: 3,
      unitPrice: 5.99
    })

    expect(result.success).toBe(true)
    expect(result.cart!.items).toHaveLength(2)
  })

  it('combines quantities for same product', async () => {
    // Add first instance of product
    await useCase({
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 2,
      unitPrice: 10.99
    })

    // Add more of the same product
    const result = await useCase({
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 3,
      unitPrice: 10.99
    })

    expect(result.success).toBe(true)
    expect(result.cart!.items).toHaveLength(1)
    expect(result.cart!.items[0].quantity).toBe(5)
  })

  it('handles invalid input', async () => {
    const result = await useCase({
      cartId: '',
      productId: 'product-1',
      quantity: 2,
      unitPrice: 10.99
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid request parameters')
  })

  it('handles invalid quantity', async () => {
    const result = await useCase({
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 0,
      unitPrice: 10.99
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid request parameters')
  })
})

describe('GetCart Use Case', () => {
  let repository: MockCartRepository
  let useCase: ReturnType<typeof createGetCartUseCase>

  beforeEach(() => {
    repository = new MockCartRepository()
    useCase = createGetCartUseCase(repository)
  })

  it('returns existing cart', async () => {
    const cart = createCart('cart-1')
    await repository.save(cart)

    const result = await useCase({ cartId: 'cart-1' })

    expect(result.success).toBe(true)
    expect(result.cart).toBeDefined()
    expect(result.cart!.id).toBe('cart-1')
  })

  it('creates empty cart for non-existent cart', async () => {
    const result = await useCase({ cartId: 'non-existent' })

    expect(result.success).toBe(true)
    expect(result.cart).toBeDefined()
    expect(result.cart!.id).toBe('non-existent')
    expect(result.cart!.items).toHaveLength(0)
  })

  it('handles empty cart ID', async () => {
    const result = await useCase({ cartId: '' })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Cart ID is required')
  })
})

describe('CheckoutCart Use Case', () => {
  let repository: MockCartRepository
  let useCase: ReturnType<typeof createCheckoutCartUseCase>
  let addItemUseCase: ReturnType<typeof createAddItemToCartUseCase>

  beforeEach(() => {
    repository = new MockCartRepository()
    useCase = createCheckoutCartUseCase(repository)
    addItemUseCase = createAddItemToCartUseCase(repository)
  })

  it('checks out cart with items', async () => {
    // Add items to cart first
    await addItemUseCase({
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 2,
      unitPrice: 10.99
    })

    await addItemUseCase({
      cartId: 'cart-1',
      productId: 'product-2',
      quantity: 1,
      unitPrice: 5.99
    })

    const result = await useCase({ cartId: 'cart-1' })

    expect(result.success).toBe(true)
    expect(result.total).toBeDefined()
    expect(result.total!.amount).toBe(27.97) // (10.99 * 2) + (5.99 * 1)
    expect(result.total!.currency).toBe('USD')
    expect(result.itemCount).toBe(3)

    // Cart should be deleted after checkout
    const cartAfterCheckout = await repository.findById('cart-1')
    expect(cartAfterCheckout).toBeNull()
  })

  it('returns error for non-existent cart', async () => {
    const result = await useCase({ cartId: 'non-existent' })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Cart not found')
  })

  it('returns error for empty cart', async () => {
    const cart = createCart('cart-1')
    await repository.save(cart)

    const result = await useCase({ cartId: 'cart-1' })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Cannot checkout empty cart')
  })

  it('handles empty cart ID', async () => {
    const result = await useCase({ cartId: '' })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Cart ID is required')
  })
})