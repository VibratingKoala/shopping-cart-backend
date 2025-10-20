import { describe, it, expect } from 'vitest'
import { createMoney } from '../value-objects/Money'
import { createProductId } from '../value-objects/ProductId'
import {
  createCart,
  createCartItem,
  addItemToCart,
  updateItemInCart,
  removeItemFromCart,
  calculateCartTotal,
  calculateItemTotal,
  getCartItemCount,
  isCartEmpty,
  updateItemQuantity
} from './Cart'

describe('CartItem', () => {
  it('creates cart item with valid data', () => {
    const productId = createProductId('product-1')
    const unitPrice = createMoney(10.99, 'USD')
    const item = createCartItem(productId, 2, unitPrice)

    expect(item.productId).toBe(productId)
    expect(item.quantity).toBe(2)
    expect(item.unitPrice).toBe(unitPrice)
  })

  it('throws on invalid quantity', () => {
    const productId = createProductId('product-1')
    const unitPrice = createMoney(10.99, 'USD')

    expect(() => createCartItem(productId, 0, unitPrice)).toThrow()
    expect(() => createCartItem(productId, -1, unitPrice)).toThrow()
    expect(() => createCartItem(productId, 1.5, unitPrice)).toThrow()
  })

  it('calculates item total correctly', () => {
    const productId = createProductId('product-1')
    const unitPrice = createMoney(10.5, 'USD')
    const item = createCartItem(productId, 3, unitPrice)

    const total = calculateItemTotal(item)
    expect(total.amount).toBe(31.5)
    expect(total.currency).toBe('USD')
  })

  it('updates item quantity', () => {
    const productId = createProductId('product-1')
    const unitPrice = createMoney(10.99, 'USD')
    const item = createCartItem(productId, 2, unitPrice)

    const updatedItem = updateItemQuantity(item, 5)
    expect(updatedItem.quantity).toBe(5)
    expect(updatedItem.productId).toBe(productId)
    expect(updatedItem.unitPrice).toBe(unitPrice)
  })
})

describe('Cart', () => {
  it('creates empty cart with valid ID', () => {
    const cart = createCart('cart-123')

    expect(cart.id).toBe('cart-123')
    expect(cart.items).toHaveLength(0)
    expect(cart.createdAt).toBeInstanceOf(Date)
    expect(cart.updatedAt).toBeInstanceOf(Date)
  })

  it('trims cart ID', () => {
    const cart = createCart('  cart-456  ')
    expect(cart.id).toBe('cart-456')
  })

  it('throws on invalid cart ID', () => {
    expect(() => createCart('')).toThrow()
    expect(() => createCart('   ')).toThrow()
    expect(() => createCart(null as any)).toThrow()
  })

  it('adds new item to empty cart', () => {
    const cart = createCart('cart-1')
    const productId = createProductId('product-1')
    const item = createCartItem(productId, 2, createMoney(10.99, 'USD'))

    const updatedCart = addItemToCart(cart, item)

    expect(updatedCart.items).toHaveLength(1)
    expect(updatedCart.items[0]).toBe(item)
    expect(updatedCart.updatedAt).not.toBe(cart.updatedAt)
  })

  it('combines quantities when adding existing product', () => {
    const cart = createCart('cart-1')
    const productId = createProductId('product-1')
    const item1 = createCartItem(productId, 2, createMoney(10.99, 'USD'))
    const item2 = createCartItem(productId, 3, createMoney(10.99, 'USD'))

    const cartWithFirstItem = addItemToCart(cart, item1)
    const finalCart = addItemToCart(cartWithFirstItem, item2)

    expect(finalCart.items).toHaveLength(1)
    expect(finalCart.items[0].quantity).toBe(5)
  })

  it('updates item quantity in cart', () => {
    const cart = createCart('cart-1')
    const productId = createProductId('product-1')
    const item = createCartItem(productId, 2, createMoney(10.99, 'USD'))

    const cartWithItem = addItemToCart(cart, item)
    const updatedCart = updateItemInCart(cartWithItem, productId, 5)

    expect(updatedCart.items[0].quantity).toBe(5)
  })

  it('removes item when updating quantity to 0', () => {
    const cart = createCart('cart-1')
    const productId = createProductId('product-1')
    const item = createCartItem(productId, 2, createMoney(10.99, 'USD'))

    const cartWithItem = addItemToCart(cart, item)
    const updatedCart = updateItemInCart(cartWithItem, productId, 0)

    expect(updatedCart.items).toHaveLength(0)
  })

  it('throws when updating non-existent product', () => {
    const cart = createCart('cart-1')
    const productId = createProductId('product-1')

    expect(() => updateItemInCart(cart, productId, 5)).toThrow('Product not found in cart')
  })

  it('removes item from cart', () => {
    const cart = createCart('cart-1')
    const productId1 = createProductId('product-1')
    const productId2 = createProductId('product-2')
    const item1 = createCartItem(productId1, 2, createMoney(10.99, 'USD'))
    const item2 = createCartItem(productId2, 1, createMoney(15.99, 'USD'))

    const cartWithItems = addItemToCart(addItemToCart(cart, item1), item2)
    const updatedCart = removeItemFromCart(cartWithItems, productId1)

    expect(updatedCart.items).toHaveLength(1)
    expect(updatedCart.items[0].productId.value).toBe('product-2')
  })

  it('calculates cart total correctly', () => {
    const cart = createCart('cart-1')
    const productId1 = createProductId('product-1')
    const productId2 = createProductId('product-2')
    const item1 = createCartItem(productId1, 2, createMoney(10.5, 'USD'))
    const item2 = createCartItem(productId2, 1, createMoney(5.99, 'USD'))

    const cartWithItems = addItemToCart(addItemToCart(cart, item1), item2)
    const total = calculateCartTotal(cartWithItems)

    expect(total.amount).toBeCloseTo(26.99, 2) // (10.50 * 2) + (5.99 * 1)
    expect(total.currency).toBe('USD')
  })

  it('returns zero total for empty cart', () => {
    const cart = createCart('cart-1')
    const total = calculateCartTotal(cart)

    expect(total.amount).toBe(0)
    expect(total.currency).toBe('USD')
  })

  it('counts total item quantity', () => {
    const cart = createCart('cart-1')
    const productId1 = createProductId('product-1')
    const productId2 = createProductId('product-2')
    const item1 = createCartItem(productId1, 3, createMoney(10.99, 'USD'))
    const item2 = createCartItem(productId2, 2, createMoney(15.99, 'USD'))

    const cartWithItems = addItemToCart(addItemToCart(cart, item1), item2)
    const itemCount = getCartItemCount(cartWithItems)

    expect(itemCount).toBe(5)
  })

  it('detects empty cart', () => {
    const emptyCart = createCart('cart-1')
    const productId = createProductId('product-1')
    const item = createCartItem(productId, 1, createMoney(10.99, 'USD'))
    const cartWithItems = addItemToCart(emptyCart, item)

    expect(isCartEmpty(emptyCart)).toBe(true)
    expect(isCartEmpty(cartWithItems)).toBe(false)
  })
})
