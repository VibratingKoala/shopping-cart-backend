import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCartRepository } from './InMemoryCartRepository'
import { createCart, addItemToCart, createCartItem } from '../../domain/entities/Cart'
import { createProductId } from '../../domain/value-objects/ProductId'
import { createMoney } from '../../domain/value-objects/Money'

describe('InMemoryCartRepository', () => {
  let repository: InMemoryCartRepository

  beforeEach(() => {
    repository = new InMemoryCartRepository()
  })

  it('saves and retrieves cart', async () => {
    const cart = createCart('cart-1')
    
    await repository.save(cart)
    const retrievedCart = await repository.findById('cart-1')

    expect(retrievedCart).toBeDefined()
    expect(retrievedCart!.id).toBe('cart-1')
  })

  it('returns null for non-existent cart', async () => {
    const cart = await repository.findById('non-existent')
    expect(cart).toBeNull()
  })

  it('updates existing cart', async () => {
    const cart = createCart('cart-1')
    await repository.save(cart)

    // Create updated cart with items
    const productId = createProductId('product-1')
    const item = createCartItem(productId, 2, createMoney(10.99, 'USD'))
    const updatedCart = addItemToCart(cart, item)

    await repository.save(updatedCart)
    const retrievedCart = await repository.findById('cart-1')

    expect(retrievedCart!.items).toHaveLength(1)
    expect(retrievedCart!.items[0].quantity).toBe(2)
  })

  it('deletes cart', async () => {
    const cart = createCart('cart-1')
    await repository.save(cart)

    await repository.delete('cart-1')
    const retrievedCart = await repository.findById('cart-1')

    expect(retrievedCart).toBeNull()
  })

  it('counts carts correctly', async () => {
    expect(await repository.count()).toBe(0)

    await repository.save(createCart('cart-1'))
    await repository.save(createCart('cart-2'))

    expect(await repository.count()).toBe(2)
  })

  it('clears all carts', async () => {
    await repository.save(createCart('cart-1'))
    await repository.save(createCart('cart-2'))

    await repository.clear()

    expect(await repository.count()).toBe(0)
  })

  it('finds all carts', async () => {
    const cart1 = createCart('cart-1')
    const cart2 = createCart('cart-2')

    await repository.save(cart1)
    await repository.save(cart2)

    const allCarts = await repository.findAll()

    expect(allCarts).toHaveLength(2)
    expect(allCarts.map(c => c.id)).toContain('cart-1')
    expect(allCarts.map(c => c.id)).toContain('cart-2')
  })

  it('handles concurrent operations', async () => {
    const cart = createCart('cart-1')
    
    // Simulate concurrent saves
    const promises = [
      repository.save(cart),
      repository.save(cart),
      repository.save(cart)
    ]

    await Promise.all(promises)

    const retrievedCart = await repository.findById('cart-1')
    expect(retrievedCart).toBeDefined()
    expect(await repository.count()).toBe(1)
  })
})