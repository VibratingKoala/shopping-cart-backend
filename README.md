# 🛒 Shopping Cart Backend API

A production-ready shopping cart API built with **Domain-Driven Design** principles, **Clean Architecture**, and **TypeScript**.

## ✨ Features

- **Complete Shopping Cart API** with add, get, and checkout operations
- **Domain-Driven Design** with proper separation of concerns
- **Clean Architecture** with ports and adapters pattern
- **Comprehensive Test Coverage** (targeting >70%)
- **Production-Ready Infrastructure** with Docker and AWS ECS
- **CI/CD Pipeline** with GitHub Actions
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
    "unitPrice": 29.99,
    "currency": "USD"
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

# Run tests in watch mode
npm run test -- --watch
```

Test files follow the pattern `*.spec.ts` and are located alongside the source files.

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

### ✅ What's Included
- **In-memory storage** for simplicity and fast development
- **Domain-first design** with rich business logic
- **Complete CI/CD pipeline** with automated deployment
- **Production-ready infrastructure** with AWS ECS
- **Comprehensive testing** with coverage reporting

### 🔄 Future Enhancements
- **Database integration** (PostgreSQL, DynamoDB)
- **Authentication & authorization**
- **Rate limiting & caching**
- **Observability** (metrics, tracing)
- **Advanced inventory management**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for your changes
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
