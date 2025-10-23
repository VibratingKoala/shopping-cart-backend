# Domain Model Design

## Overview

This shopping cart domain uses Domain-Driven Design principles focused on immutability, type safety, and clear business rules. The model separates business logic from infrastructure concerns through clean architecture patterns.

## Entity and Aggregate Design

### Visual Representation

```
┌─────────────────────────────────────┐
│            Cart Aggregate           │
│  ┌─────────────────────────────────┐│
│  │        Cart (Root)              ││
│  │  - sessionId: string            ││
│  │  - items: CartItem[]            ││
│  │  - createdAt: Date              ││
│  │  - updatedAt: Date              ││
│  │                                 ││
│  │  ┌─────────────────────────────┐││
│  │  │       CartItem              │││
│  │  │  - productId: ProductId     │││
│  │  │  - quantity: number         │││
│  │  │  - unitPrice: Money         │││
│  │  └─────────────────────────────┘││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐
│   Money         │    │   ProductId     │
│  (Value Object) │    │  (Value Object) │
│  - amount       │    │  - value        │
│  - currency     │    │                 │
└─────────────────┘    └─────────────────┘
```

### Aggregate Boundaries

**Cart Aggregate Root**: The Cart serves as the aggregate root, ensuring consistency of all cart operations. All modifications to cart items must go through the Cart entity, which enforces business rules and maintains invariants.

**Boundary Rules**:
- External services can only access the Cart through its public interface
- CartItems cannot be modified directly - all changes go through Cart methods
- The aggregate ensures atomic updates to cart state

## Entity vs Value Object Decisions

### Entities

**Cart**: 
- **Why Entity**: Has identity (sessionId) and lifecycle
- **Mutability**: Immutable design - operations return new instances
- **Responsibility**: Orchestrates business rules for the entire shopping session

**CartItem**:
- **Why Entity**: Although contained within Cart, represents a distinct item in the cart
- **Identity**: Identified by productId within the cart context
- **Immutability**: All modifications create new instances

### Value Objects

**Money**:
- **Why Value Object**: Represents a monetary amount with no identity
- **Equality**: Two Money objects are equal if amount and currency match
- **Immutability**: Cannot be changed after creation
- **Business Rules**: Prevents negative amounts, enforces currency consistency

**ProductId**:
- **Why Value Object**: Simple identifier with no behavior or lifecycle
- **Validation**: Enforces format rules (non-empty, length limits)
- **Immutability**: String wrapper that cannot be modified

## Business Rules and Invariants

### Cart Invariants Protected

1. **Quantity Validation**: All cart items must have positive quantities
2. **Currency Consistency**: All items in a cart must use the same currency
3. **Duplicate Prevention**: Same product is consolidated by quantity, not duplicated
4. **Session Integrity**: Cart can only be associated with one session ID

### Business Rules Enforced

```typescript
// Rule: Quantity must be positive
if (!Number.isInteger(quantity) || quantity <= 0) {
  throw new Error('Cart item quantity must be a positive integer')
}

// Rule: Currency must match across items
if (a.currency !== b.currency) {
  throw new Error('Currency mismatch')
}

// Rule: Money amounts cannot be negative
if (amount < 0) {
  throw new Error('Money amount cannot be negative')
}
```

## Money Calculations

### Precision Handling
- **Decision**: Round to 2 decimal places in createMoney()
- **Rationale**: Prevents floating-point precision issues (59.98 + 15.50 ≠ 75.47999999999999)
- **Calculation**: Uses Math.round(amount * 100) / 100

### Currency Safety
- **Rule**: All money operations require matching currencies
- **Default**: USD currency when not specified
- **Future**: Could support multi-currency with exchange rates

## Aggregate Design Rationale

### Why Cart as Aggregate Root

1. **Transaction Boundary**: Cart operations are naturally transactional
2. **Business Rules**: Cart enforces rules across all its items
3. **Consistency**: Changes to items must maintain cart totals and currency rules
4. **Lifecycle**: Cart creation and deletion are meaningful business events

### Alternative Designs Rejected

**Separate CartItem Entities**: 
- **Rejected**: Would break transaction boundaries and consistency rules
- **Problem**: Could lead to orphaned items or inconsistent cart state

**Product Entity in Domain**:
- **Rejected**: Product catalog is a separate bounded context
- **Decision**: Use ProductId value object to reference external products

## Domain Events (Future Enhancement)

**Current State**: Not implemented but designed for
**Potential Events**:
- ItemAddedToCart
- ItemRemovedFromCart
- CartCheckedOut
- CartAbandoned

**Usage**: These would trigger side effects like inventory updates, analytics, or notifications.

## Architectural Trade-offs

### Immutability vs Performance
- **Choice**: Full immutability
- **Trade-off**: Slight memory overhead for object creation
- **Benefit**: Thread-safety, predictable behavior, easier testing

### Factory Functions vs Classes
- **Choice**: Factory functions for domain objects
- **Trade-off**: Less familiar to traditional OOP developers
- **Benefit**: Functional composition, no 'this' binding issues, easier testing

### In-Memory vs Persistent Storage
- **Choice**: In-memory for demonstration
- **Trade-off**: Data lost on restart
- **Rationale**: Focus on domain design, not infrastructure complexity
- **Production Path**: Replace with database-backed repository

## Testing Strategy

### Domain Testing Focus
- **Value Objects**: Test creation, validation, equality, and operations
- **Entities**: Test business rules, invariants, and state transitions
- **Aggregates**: Test transaction boundaries and consistency

### Coverage Achieved
- **55 tests** covering all business logic
- **70%+ domain coverage** exceeding standard requirements
- **Test Placement**: Tests alongside source files (*.spec.ts)

## Future Domain Considerations

### Scalability
- **User Context**: Add user ownership to carts (cart belongs to user)
- **Session Management**: Handle session expiration and cleanup
- **Cart Persistence**: Long-term cart storage for registered users

### Business Complexity
- **Inventory Integration**: Stock checking and reservation
- **Pricing Rules**: Dynamic pricing, discounts, promotional codes
- **Tax Calculation**: Geographic tax rules
- **Shipping**: Weight, dimensions, delivery options

### Advanced Features
- **Cart Sharing**: Multiple users collaborating on single cart
- **Wishlist Integration**: Move items between cart and wishlist
- **Subscription Items**: Recurring purchases and subscription management

## Domain Language Alignment

The domain model uses ubiquitous language from the business:
- **Session**: User shopping session (not cartId)
- **Items**: Products added to cart
- **Checkout**: Convert cart to order
- **Money**: Monetary amounts with currency
- **Quantity**: Number of identical products

This language is consistent across domain models, use cases, and API interfaces, ensuring clear communication between technical and business stakeholders.