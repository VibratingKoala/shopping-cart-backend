# Shopping Cart Backend API

A TypeScript REST API for managing shopping carts, built with clean architecture principles and modern development practices. Features thorough testing, domain-driven design, and production-ready infrastructure automation.

## ✨ Key Features

- **Clean Architecture**: Strict separation of concerns with dependency inversion
- **Domain-Driven Design**: Rich domain models with enforced business rules
- **Thorough Testing**: 55+ tests covering business logic and integrations
- **Production Ready**: Docker containers, CI/CD pipelines, and AWS infrastructure
- **Type Safety**: Full TypeScript implementation with strict mode enabled

## 📡 API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/cart/:sessionId/items` | Add product to cart |
| GET | `/api/cart/:sessionId` | Get cart contents |
| POST | `/api/cart/:sessionId/checkout` | Checkout cart |
| DELETE | `/api/cart/:sessionId/items/:itemId` | Remove item from cart |

### Example Usage

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

### Domain Layer (`src/domain/`)
- **Value Objects**: `Money`, `ProductId` - Immutable objects with validation
- **Entities**: `Cart`, `CartItem` - Business logic and rules
- **Business Rules**: Quantity validation, currency matching, total calculations

### Application Layer (`src/application/`)
- **Use Cases**: `AddItemToCart`, `GetCart`, `CheckoutCart` - Application logic
- **Ports**: `CartRepository` - Interfaces for external dependencies

### Infrastructure Layer (`src/infrastructure/`)
- **Repositories**: `InMemoryCartRepository` - Data persistence
- **Web**: Express.js controllers and API setup

## 🧪 Testing

The project includes solid test coverage:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Test API endpoints (requires server running)
.\test-api-simple.ps1
```

**Test Coverage:**
- **55 tests** covering domain logic and business rules
- **70%+ coverage** on critical business components
- **Integration tests** for API endpoints and repository interactions
- Test files use the pattern `*.spec.ts` alongside source code for maintainability

## 🐋 Docker

### Development
```bash
# Build and run development container
docker-compose -f infra/docker/dev/docker-compose.yml up

# Or build development image manually
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

The project includes complete Terraform configuration for AWS deployment:

- **VPC** with public/private subnets
- **Application Load Balancer** with health checks
- **ECS Fargate** cluster and service
- **CloudWatch** logging
- **Security Groups** with least privilege access

```bash
cd infra/terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Deploy infrastructure
terraform apply
```

### CI/CD Pipeline

Automated workflows handle:
- **Code Quality**: Testing, linting, and security scanning
- **Deployment**: Docker image building and infrastructure management
- **Integration**: Automatic validation on pull requests and main branch updates

## 📁 Project Structure

```
shopping-cart-backend/
├── src/
│   ├── domain/
│   │   ├── entities/           # Cart, CartItem
│   │   └── value-objects/      # Money, ProductId
│   ├── application/
│   │   ├── ports/              # Repository interfaces
│   │   └── use-cases/          # Business use cases
│   ├── infrastructure/
│   │   ├── repositories/       # Data persistence
│   │   └── web/               # Express API
│   └── server.ts              # Application entry point
├── infra/
│   ├── docker/                # Docker configurations
│   └── terraform/             # Infrastructure as Code
├── .github/workflows/         # CI/CD pipelines
└── tests covering 70%+          # Full test suite
```

## 🔧 Development Setup

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | Server port | `3000` |

### Code Quality Tools

The project maintains high code quality with:
- ESLint with TypeScript-specific rules
- Prettier for consistent code formatting
- Pre-commit hooks for automated validation

## � Development Workflow

1. **Branch creation**: `git checkout -b feature/feature-name`
2. **Test-driven development**: Write tests before implementation
3. **Implementation**: Follow clean architecture principles
4. **Quality assurance**: `npm run lint && npm test`
5. **Pull request**: Automated validation via CI pipeline
6. **Deployment**: Automatic deployment on merge to main

## � Architecture & Design Decisions

### Core Principles

**Clean Architecture**: Business logic remains independent of external frameworks and databases
**Immutable Operations**: All data modifications return new instances, preventing side effects
**Functional Style**: Factory functions preferred over classes for simpler composition
**Type Safety**: Strict TypeScript configuration catches errors at compile time

### Current Scope
- **Storage**: In-memory persistence (easily swappable via repository pattern)
- **Security**: Public cart access (ready for authentication layer)
- **Currency**: USD support (extensible to multiple currencies)
- **Validation**: Core business rules (expandable for complex scenarios)

### Production Features
- **Container Security**: Multi-stage Docker builds with non-root execution
- **Cloud Infrastructure**: Scalable AWS ECS with load balancing
- **Automation**: Full CI/CD pipeline with testing and deployment
- **Observability**: Health checks and structured logging integration

### Growth Path
- **Database**: PostgreSQL replacement for in-memory storage
- **Authentication**: JWT-based user sessions and cart ownership
- **Catalog Integration**: External product service connectivity
- **Enhanced Features**: Inventory management, promotions, tax calculations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for your changes
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
