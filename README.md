# Shopping Cart Backend API

A TypeScript-based shopping cart REST API built with clean architecture principles, comprehensive testing, and production-ready deployment configuration.

## ✨ Features

- **Complete Shopping Cart API** with add, get, and checkout operations
- **Domain-Driven Design** with immutable entities and value objects
- **Clean Architecture** with dependency inversion and ports/adapters
- **49 comprehensive tests** with >70% coverage achieved
- **Production-Ready Infrastructure** with Docker and AWS ECS
- **Complete CI/CD Pipeline** with GitHub Actions
- **Infrastructure as Code** with Terraform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup (Windows PowerShell)

If you encounter PowerShell execution policy issues, run this first as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then install dependencies:
```powershell
npm install
```

### Development Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Build for production
npm run build

# Start development server (with hot reload)
npm run dev

# Start production server
npm start
```

## 📡 API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/carts/:cartId/items` | Add item to cart |
| GET | `/api/carts/:cartId` | Get cart contents |
| POST | `/api/carts/:cartId/checkout` | Checkout cart |

### Example Usage

**Add item to cart:**
```bash
curl -X POST http://localhost:3000/api/carts/cart-123/items \
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

**Get cart:**
```bash
curl http://localhost:3000/api/carts/cart-123
```

**Checkout cart:**
```bash
curl -X POST http://localhost:3000/api/carts/cart-123/checkout
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

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Test API endpoints (requires server running)
.\test-api-simple.ps1
```

**Test Coverage:**
- **49 unit and integration tests** covering all business logic
- **>70% coverage** on domain and application layers
- **API integration tests** via PowerShell scripts
- Test files follow the pattern `*.spec.ts` and are located alongside source files

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

GitHub Actions workflows handle:
- **Continuous Integration**: Testing, linting, security scanning
- **Continuous Deployment**: Docker image building, infrastructure updates, service deployment

Workflows are triggered on pushes to `main` and pull requests.

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
└── tests covered >70%         # Comprehensive test suite
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |

### ESLint & Prettier

Code quality is enforced with:
- ESLint with TypeScript rules
- Prettier for consistent formatting
- Git hooks for pre-commit validation

## 🚦 Development Workflow

1. **Create feature branch**: `git checkout -b feature/your-feature`
2. **Write tests first**: Follow TDD principles
3. **Implement feature**: Maintain clean architecture
4. **Run quality checks**: `npm run lint && npm test`
5. **Create pull request**: CI pipeline will validate changes
6. **Merge to main**: Triggers automated deployment

## 📋 Trade-offs & Design Decisions

### Key Architectural Choices

**Clean Architecture**: Strict dependency rules ensure business logic is independent of frameworks
**Immutable Design**: All operations return new instances, eliminating shared state bugs
**Factory Functions**: Preferred over classes for simpler testing and functional style
**TypeScript Strict Mode**: Compile-time guarantees and better developer experience

### Current Limitations
- **In-memory storage**: Data lost on restart (easily replaceable via repository pattern)
- **No authentication**: All carts are public (JWT integration straightforward)
- **Single currency**: USD only (configurable in Money value object)
- **Basic validation**: Could be more granular with detailed error messages

### Production Readiness
- **Docker multi-stage builds** with non-root user for security
- **AWS ECS infrastructure** with load balancer and auto-scaling
- **CI/CD pipeline** with automated testing and deployment
- **Monitoring setup** with health checks and structured logging

### Future Enhancements
- **PostgreSQL integration** replacing in-memory repository
- **User authentication** with JWT tokens and cart ownership
- **Product catalog integration** with external services
- **Advanced features**: inventory, discounts, tax calculation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for your changes
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
