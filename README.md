# Shopping Cart Backend API

A REST API for managing shopping carts built with TypeScript and clean architecture. This project implements a traditional e-commerce cart system with proper domain modeling and production-ready infrastructure.

## ✨ Features

- **Clean Architecture**: Business logic separated from framework concerns
- **Domain-Driven Design**: Core business rules enforced through rich domain models  
- **Comprehensive Testing**: 55+ tests covering all critical functionality
- **Production Ready**: Docker setup, CI/CD pipelines, and cloud infrastructure
- **Type Safety**: Strict TypeScript with comprehensive type checking

## 📡 API Endpoints

The API runs on `http://localhost:3000` by default.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/cart/:sessionId/items` | Add product to cart |
| GET | `/api/cart/:sessionId` | Get cart contents |
| POST | `/api/cart/:sessionId/checkout` | Checkout cart |
| DELETE | `/api/cart/:sessionId/items/:itemId` | Remove item from cart |

### Usage Examples

**Add item to cart:**
```bash
curl -X POST http://localhost:3000/api/cart/session-123/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product-456",
    "quantity": 2,
    "unitPrice": {
      "amount": 29.99,
      "currency": "USD"
    }
  }'
```

**Remove item from cart:**
```bash
curl -X DELETE http://localhost:3000/api/cart/session-123/items/product-456
```

## 🏗️ Architecture

This project follows clean architecture principles with clear separation between layers:

### Domain Layer (`src/domain/`)
Core business logic and rules:
- **Entities**: `Cart`, `CartItem` - Main business objects
- **Value Objects**: `Money`, `ProductId` - Immutable objects with validation
- **Repositories**: Interface definitions for data access
- **Errors**: Business-specific error types

### Use Cases Layer (`src/usecases/`)
Application-specific business rules:
- `AddItemToCart`, `GetCart`, `CheckoutCart`, `RemoveItemFromCart`

### Adapters Layer (`src/adapters/`)
Interface adapters that connect the use cases to external concerns:
- **Controllers**: HTTP request/response handling
- **Repositories**: Data persistence implementations

### Infrastructure Layer (`src/infrastructure/`)
Framework and external tool configurations:
- **Server**: Express.js application setup
- **Routes**: HTTP routing configuration
- **Storage**: Data storage setup

## 🧪 Testing

Run the test suite to verify everything works:

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Test API endpoints (server must be running)
.\test-quick.ps1
```

The project has 55 tests covering the core business logic, API endpoints, and integrations. Tests are co-located with source files using the `*.spec.ts` pattern.

## 🐋 Docker

### Development
```bash
# Run with docker-compose
docker-compose -f infra/docker/dev/docker-compose.yml up

# Or build manually
docker build -f infra/docker/dev/Dockerfile -t shopping-cart-dev .
docker run -p 3000:3000 -v $(pwd)/src:/app/src shopping-cart-dev
```

### Production
```bash
# Build production image
docker build -f infra/docker/prod/Dockerfile -t shopping-cart-api .

# Run production container
docker run -p 3000:3000 shopping-cart-api
```

## ☁️ Deployment

### AWS Infrastructure

The `infra/terraform` directory contains infrastructure-as-code for AWS deployment:

- VPC with public/private subnets across multiple AZs
- Application Load Balancer with health checks  
- ECS Fargate cluster for container orchestration
- CloudWatch logging and monitoring
- Security groups following least privilege principles

```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

### CI/CD

GitHub Actions handles automated testing, building, and deployment:
- Runs tests and linting on every push
- Builds and validates Docker images
- Performs security scanning
- Deploys to AWS on main branch updates

## 📁 Project Structure

```
shopping-cart-backend/
├── src/
│   ├── domain/
│   │   ├── entities/           # Cart, CartItem
│   │   ├── value-objects/      # Money, ProductId  
│   │   ├── repositories/       # Repository interfaces
│   │   └── errors/             # Domain error types
│   ├── usecases/              # Business use cases
│   ├── adapters/
│   │   ├── controllers/        # HTTP controllers
│   │   └── repositories/       # Data persistence
│   └── infrastructure/
│       ├── server.ts          # Application entry point
│       ├── routes.ts          # Route definitions
│       └── storage/           # Storage configuration
├── infra/
│   ├── docker/                # Docker configurations
│   └── terraform/             # Infrastructure as Code
├── .github/workflows/         # CI/CD pipelines
└── test-quick.ps1            # API testing script
```

## 🔧 Development Setup

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | Server port | `3000` |

### Getting Started

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Start development server: `npm run dev`
4. Test API endpoints: `.\test-quick.ps1`

The project uses ESLint and Prettier for code quality and consistent formatting.

## 🏛️ Design Decisions

### Architecture Principles
- **Dependency Inversion**: Business logic doesn't depend on external frameworks
- **Immutability**: Data structures are immutable to prevent unexpected side effects  
- **Type Safety**: Strict TypeScript configuration catches errors at compile time
- **Testability**: Architecture supports comprehensive unit and integration testing

### Current Implementation
- **Storage**: In-memory persistence (easily replaceable via repository pattern)
- **Security**: Session-based cart access (ready for authentication layer)
- **Currency**: USD only (designed for multi-currency extension)
- **Validation**: Core business rules with room for complex scenarios

### Production Considerations
- **Security**: Non-root Docker containers and security scanning
- **Scalability**: AWS ECS with auto-scaling capabilities
- **Observability**: Health checks and structured logging
- **Automation**: Full CI/CD pipeline with quality gates

### Future Enhancements
- Replace in-memory storage with PostgreSQL
- Add user authentication and cart ownership
- Integrate with external product catalog
- Add inventory management and promotions

## 📄 License

MIT License
