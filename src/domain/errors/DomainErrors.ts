export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainError'
  }
}

export class CartNotFoundError extends DomainError {
  constructor(sessionId: string) {
    super(`Cart not found for session: ${sessionId}`)
    this.name = 'CartNotFoundError'
  }
}

export class InvalidQuantityError extends DomainError {
  constructor(quantity: number) {
    super(`Invalid quantity: ${quantity}. Quantity must be greater than 0`)
    this.name = 'InvalidQuantityError'
  }
}

export class InvalidPriceError extends DomainError {
  constructor(price: number) {
    super(`Invalid price: ${price}. Price must be greater than 0`)
    this.name = 'InvalidPriceError'
  }
}

export class CurrencyMismatchError extends DomainError {
  constructor(currency1: string, currency2: string) {
    super(`Currency mismatch: ${currency1} vs ${currency2}`)
    this.name = 'CurrencyMismatchError'
  }
}

export class EmptyCartCheckoutError extends DomainError {
  constructor() {
    super('Cannot checkout an empty cart')
    this.name = 'EmptyCartCheckoutError'
  }
}

export class ItemNotFoundError extends DomainError {
  constructor(productId: string) {
    super(`Item not found in cart: ${productId}`)
    this.name = 'ItemNotFoundError'
  }
}
