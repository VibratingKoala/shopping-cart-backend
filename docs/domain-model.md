# Domain Model

## Overview

The shopping cart domain follows Domain-Driven Design principles with a focus on immutability, type safety, and clear business rules. The model separates business logic from infrastructure concerns using clean architecture patterns.

## Domain Entities

### Cart Aggregate Root

The `Cart` serves as the aggregate root, ensuring consistency of all cart operations.

```typescript
type Cart = {
  readonly id: string
  readonly items: readonly CartItem[]
  readonly createdAt: Date
  readonly updatedAt: Date
}
```

**Business Rules:**
- Cart ID must be a non-empty string
- Items are immutable - modifications create new cart instances
- Automatic timestamp tracking for audit trail
- Empty carts are valid and can be retrieved

### CartItem Entity

```typescript
type CartItem = {
  readonly productId: ProductId
  readonly quantity: number
  readonly unitPrice: Money
}
```

**Business Rules:**
- Quantity must be a positive integer
- Same product items are consolidated (quantities added)
- Each item tracks its own pricing (supports price changes over time)

## Value Objects

### Money

Handles monetary calculations with currency awareness and precision.

```typescript
type Money = {
  readonly amount: number
  readonly currency: string
}
```

**Design Decisions:**
- Rounds to 2 decimal places to avoid floating-point precision issues
- Enforces non-negative amounts
- Currency-safe operations (prevents mixing currencies)
- Defaults to USD for simplicity

### ProductId

Strongly-typed product identifier with validation.

```typescript
type ProductId = {
  readonly value: string
}
```

**Business Rules:**
- Maximum 100 characters to prevent abuse
- Whitespace trimming for consistency
- Non-empty validation

## Domain Operations

### Cart Operations

```typescript
// Factory functions for creating domain objects
createCart(id: string): Cart
createCartItem(productId: ProductId, quantity: number, unitPrice: Money): CartItem

// Pure business logic functions
addItemToCart(cart: Cart, item: CartItem): Cart
updateItemInCart(cart: Cart, productId: ProductId, newQuantity: number): Cart
removeItemFromCart(cart: Cart, productId: ProductId): Cart
calculateCartTotal(cart: Cart): Money
```

### Key Design Principles

1. **Immutability**: All operations return new instances rather than mutating existing ones
2. **Pure Functions**: Business logic functions have no side effects
3. **Type Safety**: TypeScript provides compile-time guarantees
4. **Domain Language**: Function names match business terminology
5. **Validation**: Input validation at domain boundaries

## Architecture Boundaries

```
┌─────────────────┐
│   Application   │ ← Use Cases (AddItemToCart, GetCart, CheckoutCart)
│     Layer       │
├─────────────────┤
│     Domain      │ ← Entities (Cart, CartItem) + Value Objects (Money, ProductId)
│     Layer       │
├─────────────────┤
│ Infrastructure  │ ← Repository (InMemoryCartRepository), Web (Express API)
│     Layer       │
└─────────────────┘
```

The domain layer has no dependencies on external frameworks, making it easily testable and portable.

## Trade-offs and Decisions

### Why In-Memory Storage?
- **Pro**: Simple implementation, no external dependencies, fast for demonstration
- **Con**: Data lost on restart, no persistence across sessions
- **Production Alternative**: PostgreSQL with proper schema design

### Why Immutable Design?
- **Pro**: Thread-safe, predictable, easy to test and debug
- **Con**: Slight memory overhead from object creation
- **Benefit**: Eliminates entire classes of bugs related to shared mutable state

### Why Factory Functions Over Classes?
- **Pro**: Simpler, functional style, easier to test
- **Con**: Less familiar to OOP developers
- **Benefit**: Avoid `new` keyword issues and `this` binding problems

### Money Precision Handling
- **Decision**: Round to 2 decimal places in createMoney()
- **Rationale**: Prevents 59.98 + 15.50 = 75.47999999999999
- **Alternative**: Could use decimal libraries for financial precision

## Testing Strategy

- **Unit Tests**: Pure domain logic (49 tests covering business rules)
- **Integration Tests**: Use case layer with mock repository
- **API Tests**: End-to-end testing via HTTP endpoints
- **Coverage Target**: >70% domain coverage achieved

## Future Considerations

- **User Context**: Add user ownership to carts
- **Product Catalog**: Integration with external product service  
- **Inventory**: Stock checking and reservation
- **Pricing**: Dynamic pricing, discounts, tax calculation
- **Events**: Domain events for audit log and integrations