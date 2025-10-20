import { Money, createMoney, addMoney } from '../value-objects/Money'
import { ProductId } from '../value-objects/ProductId'

export type CartItem = {
  readonly productId: ProductId
  readonly quantity: number
  readonly unitPrice: Money
}

export const createCartItem = (productId: ProductId, quantity: number, unitPrice: Money): CartItem => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('Cart item quantity must be a positive integer')
  }
  
  return {
    productId,
    quantity,
    unitPrice
  }
}

export const calculateItemTotal = (item: CartItem): Money => {
  const totalAmount = item.unitPrice.amount * item.quantity
  return createMoney(totalAmount, item.unitPrice.currency)
}

export const updateItemQuantity = (item: CartItem, newQuantity: number): CartItem => {
  return createCartItem(item.productId, newQuantity, item.unitPrice)
}

export type Cart = {
  readonly id: string
  readonly items: readonly CartItem[]
  readonly createdAt: Date
  readonly updatedAt: Date
}

export const createCart = (id: string): Cart => {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Cart ID must be a non-empty string')
  }

  const now = new Date()
  return {
    id: id.trim(),
    items: [],
    createdAt: now,
    updatedAt: now
  }
}

export const addItemToCart = (cart: Cart, item: CartItem): Cart => {
  const existingItemIndex = cart.items.findIndex(
    existingItem => existingItem.productId.value === item.productId.value
  )

  const now = new Date()

  if (existingItemIndex >= 0) {
    // Update existing item quantity
    const existingItem = cart.items[existingItemIndex]
    const updatedItem = updateItemQuantity(existingItem, existingItem.quantity + item.quantity)
    
    const newItems = [...cart.items]
    newItems[existingItemIndex] = updatedItem

    return {
      ...cart,
      items: newItems,
      updatedAt: now
    }
  } else {
    // Add new item
    return {
      ...cart,
      items: [...cart.items, item],
      updatedAt: now
    }
  }
}

export const updateItemInCart = (cart: Cart, productId: ProductId, newQuantity: number): Cart => {
  const itemIndex = cart.items.findIndex(
    item => item.productId.value === productId.value
  )

  if (itemIndex === -1) {
    throw new Error('Product not found in cart')
  }

  if (newQuantity <= 0) {
    // Remove item if quantity is 0 or negative
    return removeItemFromCart(cart, productId)
  }

  const updatedItem = updateItemQuantity(cart.items[itemIndex], newQuantity)
  const newItems = [...cart.items]
  newItems[itemIndex] = updatedItem

  return {
    ...cart,
    items: newItems,
    updatedAt: new Date()
  }
}

export const removeItemFromCart = (cart: Cart, productId: ProductId): Cart => {
  const newItems = cart.items.filter(
    item => item.productId.value !== productId.value
  )

  return {
    ...cart,
    items: newItems,
    updatedAt: new Date()
  }
}

export const calculateCartTotal = (cart: Cart): Money => {
  if (cart.items.length === 0) {
    return createMoney(0, 'USD')
  }

  return cart.items.reduce((total, item) => {
    const itemTotal = calculateItemTotal(item)
    return addMoney(total, itemTotal)
  }, createMoney(0, cart.items[0].unitPrice.currency))
}

export const getCartItemCount = (cart: Cart): number => {
  return cart.items.reduce((total, item) => total + item.quantity, 0)
}

export const isCartEmpty = (cart: Cart): boolean => {
  return cart.items.length === 0
}