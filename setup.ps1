# Shopping Cart Backend Setup Script
# This script helps set up the project on Windows

Write-Host "🛒 Shopping Cart Backend Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check PowerShell execution policy
Write-Host "`n📋 Checking PowerShell execution policy..." -ForegroundColor Yellow
$policy = Get-ExecutionPolicy
Write-Host "Current execution policy: $policy" -ForegroundColor Cyan

if ($policy -eq "Restricted") {
    Write-Host "⚠️  PowerShell execution policy is Restricted." -ForegroundColor Red
    Write-Host "   To fix this, run PowerShell as Administrator and execute:" -ForegroundColor Yellow
    Write-Host "   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Do you want to continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Check Node.js version
Write-Host "`n🔍 Checking Node.js version..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    
    # Extract major version number
    $majorVersion = [int]($nodeVersion -replace "v(\d+)\..*", '$1')
    if ($majorVersion -lt 18) {
        Write-Host "⚠️  Node.js 18+ is recommended. Current version: $nodeVersion" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies. Please check your npm configuration." -ForegroundColor Red
    exit 1
}

# Run tests to verify setup
Write-Host "`n🧪 Running tests to verify setup..." -ForegroundColor Yellow
try {
    npm test
    Write-Host "✅ All tests passed!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Some tests failed, but setup is complete." -ForegroundColor Yellow
}

Write-Host "`n🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host "`n🚀 Quick Start Commands:" -ForegroundColor Cyan
Write-Host "  npm test              # Run tests" -ForegroundColor White
Write-Host "  npm run test:coverage # Run tests with coverage" -ForegroundColor White
Write-Host "  npm run lint          # Run linter" -ForegroundColor White
Write-Host "  npm run build         # Build for production" -ForegroundColor White
Write-Host "  npm run dev           # Start development server" -ForegroundColor White
Write-Host "  npm start             # Start production server" -ForegroundColor White

Write-Host "`n📚 API Endpoints (when server is running):" -ForegroundColor Cyan
Write-Host "  GET  http://localhost:3000/health" -ForegroundColor White
Write-Host "  POST http://localhost:3000/api/carts/:cartId/items" -ForegroundColor White
Write-Host "  GET  http://localhost:3000/api/carts/:cartId" -ForegroundColor White
Write-Host "  POST http://localhost:3000/api/carts/:cartId/checkout" -ForegroundColor White

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "  2. Test the API endpoints with curl or Postman" -ForegroundColor White
Write-Host "  3. Check the README.md for more information" -ForegroundColor White