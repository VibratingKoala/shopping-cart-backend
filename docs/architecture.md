# Architecture Overview

## System Architecture

This shopping cart API uses **Clean Architecture** patterns, organizing code in layers with clear dependency rules and separation of concerns.

## Layer Structure

```
src/
├── domain/              # Core Business Rules
│   ├── entities/        # Business objects (Cart, CartItem)
│   ├── value-objects/   # Value types (Money, ProductId)
│   ├── repositories/    # Repository interfaces (ports)
│   └── errors/          # Domain-specific errors
├── usecases/            # Application Business Rules  
│   └── *.ts            # Business workflows (AddItemToCart, etc.)
├── adapters/            # Interface Adapters
│   ├── controllers/     # HTTP request handlers
│   └── repositories/    # Repository implementations
└── infrastructure/      # Frameworks & Drivers
    ├── server.ts        # Application entry point
    ├── routes.ts        # Route definitions
    ├── app.ts          # Express app configuration
    └── storage/         # Storage configuration
```

## Dependency Rule

Dependencies point **inward only**:
- `Infrastructure` → `Adapters` → `UseCases` → `Domain`
- Domain layer has **zero external dependencies**
- Domain defines repository interfaces that adapters implement

## Application Flow

```
HTTP Request → Controller → Use Case → Domain Entity → Repository Interface
                   ↓           ↓          ↓              ↓
                Response ← JSON ← Result ← Business Rules ← Repository Implementation
```

## Component Interactions

### 1. Infrastructure Layer
```typescript
// Express app and route setup
app.post('/api/cart/:sessionId/items', cartController.addItem)
```
- Application server setup and configuration
- Route definitions and middleware
- Storage configuration

### 2. Adapters Layer
```typescript
// Controllers handle HTTP concerns
export const createCartController = (repository: CartRepository) => {
  // HTTP request/response handling
}

// Repository implementations
export class InMemoryCartRepository implements CartRepository {
  // Data persistence logic
}
```
- HTTP controllers for request/response handling
- Repository implementations for data persistence
- Input validation and serialization

### 3. Use Cases Layer
```typescript
// Pure business orchestration
export const createAddItemToCartUseCase = (repository: CartRepository) => {
  return async (request: AddItemToCartRequest): Promise<AddItemToCartResponse> => {
    // Coordinate domain objects and repository
  }
}
```
- Business workflow orchestration
- Repository interaction via interfaces
- Error handling and response formatting
- Transaction boundaries (if needed)

### 3. Domain Layer (Core Business Logic)
```typescript
// Pure business functions
export const addItemToCart = (cart: Cart, item: CartItem): Cart => {
  // Business rules and calculations
}
```
- Core business rules and constraints
- Entity lifecycle management
- Value object creation and validation
- Domain calculations (totals, quantities)

## Key Architectural Patterns

### Dependency Injection
```typescript
// Dependencies injected through factory functions
const cartRepository = new InMemoryCartRepository()
const addItemUseCase = createAddItemToCartUseCase(cartRepository)
const cartController = createCartController(cartRepository)
```

### Repository Pattern
```typescript
// Repository interface defined in domain layer
interface CartRepository {
  save(cart: Cart): Promise<void>
  findById(id: string): Promise<Cart | null>
  delete(id: string): Promise<void>
}

// Implementation in adapters layer
class InMemoryCartRepository implements CartRepository {
  // Implementation details
}
```
- Abstracts data persistence
- Enables easy testing with mocks
- Allows multiple storage backends

### Factory Functions
```typescript
// Domain object creation
const cart = createCart('cart-123')
const money = createMoney(29.99, 'USD')
```
- Encapsulates object creation logic
- Enforces business rules at creation time
- Immutable object construction

## Technology Choices

### Runtime & Language
- **Node.js 18+**: Modern JavaScript runtime
- **TypeScript**: Type safety and better developer experience
- **ES Modules**: Modern module system

### Web Framework
- **Express.js**: Minimal, well-established HTTP framework
- **Alternative considered**: Fastify (better performance, but Express more familiar)

### Testing
- **Vitest**: Fast test runner with TypeScript support
- **Coverage**: v8 provider for accurate coverage reporting
- **Strategy**: Unit tests for domain, integration tests for use cases

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **ts-node**: TypeScript execution for development

## Infrastructure Design

### Containerization
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder
# ... build steps
FROM node:18-alpine AS production
# ... minimal runtime image
```

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
Test → Build → Docker Push → Deploy to AWS
```

### Cloud Infrastructure (Terraform)
```
Internet → ALB → ECS Fargate → Container
                      ↓
                 CloudWatch Logs
```

## Scalability Considerations

### Current State (MVP)
- Single instance application
- In-memory storage
- Suitable for demonstration and development

### Production Scaling Path

#### Database Layer
```
InMemoryRepository → PostgreSQL → PostgreSQL + Redis Cache
```

#### Application Layer
```
Single Instance → Load Balancer + Multiple Instances → Auto Scaling
```

#### Infrastructure
```
Single Container → ECS Service → ECS with Auto Scaling → Multi-AZ Deployment
```

## Security Considerations

### Current Setup
- Basic input validation
- CORS headers for development
- No authentication (public API)

### Production Requirements
- JWT-based authentication
- Rate limiting (express-rate-limit)
- Input sanitization (helmet.js)
- HTTPS termination at load balancer
- Environment variable secrets management

## Monitoring & Observability

### Current State
- Basic console logging
- Health check endpoint

### Production Additions
- Structured logging (Winston/Pino)
- Metrics collection (Prometheus)  
- Distributed tracing (Jaeger)
- Error tracking (Sentry)
- Performance monitoring (DataDog/New Relic)

### API Design Principles

### RESTful Design
```
POST /api/cart/{sessionId}/items          # Add item
GET  /api/cart/{sessionId}                # Get cart
POST /api/cart/{sessionId}/checkout       # Checkout
DELETE /api/cart/{sessionId}/items/{itemId} # Remove item
```

### Response Consistency
```typescript
// Success responses include relevant data
{ "cart": { ... }, "message": "Item added successfully" }

// Error responses include actionable messages  
{ "error": "Quantity must be a positive number" }
```

### HTTP Status Codes
- `200 OK`: Successful operations
- `400 Bad Request`: Validation errors
- `404 Not Found`: Resource not found  
- `500 Internal Server Error`: Unexpected failures

## Testing Strategy

### Test Pyramid
```
E2E Tests (PowerShell scripts)     ←  Few, high-level
Integration Tests (Use cases)      ←  Some, focused
Unit Tests (Domain logic)          ←  Many, fast
```

### Coverage Strategy
- **Domain Layer**: >90% coverage (business-critical)
- **Application Layer**: >80% coverage (orchestration logic)
- **Infrastructure Layer**: >60% coverage (mostly integration)

## Development Workflow

### Local Development
```bash
npm run dev               # Start with hot reload
npm test                  # Run unit tests
npm run test:coverage     # Coverage report
.\test-quick.ps1         # Test API endpoints
```

### Quality Gates
- TypeScript compilation
- ESLint checks
- Test suite (55 tests)
- Coverage thresholds (70%+)

## Trade-offs and Technical Debt

### Current Technical Debt
1. **No user authentication**: All carts are public
2. **In-memory storage**: Data lost on restart
3. **Basic error handling**: Could be more granular
4. **No rate limiting**: Vulnerable to abuse

### Architectural Trade-offs
1. **Simplicity over features**: Focused on core domain
2. **In-memory over database**: Faster development, less complexity
3. **Monolith over microservices**: Simpler deployment and debugging
4. **Factory functions over classes**: More functional style

### Future Architecture Evolution

#### Phase 1: Production Ready
- Add PostgreSQL database
- Implement user authentication
- Add detailed logging
- Deploy to AWS ECS

#### Phase 2: Scale & Monitor  
- Add Redis caching
- Implement metrics and monitoring
- Add integration with product catalog
- Performance optimization

#### Phase 3: Microservices (if needed)
- Split into Cart, User, Product, Order services
- Event-driven communication
- Service mesh (Istio)
- Distributed data management