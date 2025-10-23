# Shopping Cart API Test Script
# Make sure the server is running first with: npm run dev

Write-Host "Testing Shopping Cart API..." -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    Write-Host "OK Health check passed: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "X Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure the server is running with: npm run dev" -ForegroundColor Red
    exit 1
}

# Test 2: Get empty cart
Write-Host ""
Write-Host "2. Testing Get Cart (should be empty)..." -ForegroundColor Yellow
try {
    $cart = Invoke-RestMethod -Uri "http://localhost:3000/api/cart/test-cart-1" -Method GET
    Write-Host "OK Cart retrieved successfully" -ForegroundColor Green
    Write-Host "   Cart ID: $($cart.id)" -ForegroundColor Cyan
    Write-Host "   Items: $($cart.items.Count)" -ForegroundColor Cyan
    Write-Host "   Total: $([math]::Round($cart.total.amount, 2)) $($cart.total.currency)" -ForegroundColor Cyan
} catch {
    Write-Host "X Get cart failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Add item to cart
Write-Host ""
Write-Host "3. Testing Add Item to Cart..." -ForegroundColor Yellow
$addItemBody = @{
    productId = "prod-123"
    quantity = 2
    unitPrice = @{
        amount = 29.99
        currency = "USD"
    }
} | ConvertTo-Json

try {
    $addResult = Invoke-RestMethod -Uri "http://localhost:3000/api/cart/test-cart-1/items" -Method POST -Body $addItemBody -ContentType "application/json"
    Write-Host "OK Item added successfully" -ForegroundColor Green
    Write-Host "   Message: $($addResult.message)" -ForegroundColor Cyan
} catch {
    Write-Host "X Add item failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get cart with items
Write-Host ""
Write-Host "4. Testing Get Cart (should have items)..." -ForegroundColor Yellow
try {
    $cartWithItems = Invoke-RestMethod -Uri "http://localhost:3000/api/cart/test-cart-1" -Method GET
    Write-Host "OK Cart with items retrieved successfully" -ForegroundColor Green
    Write-Host "   Cart ID: $($cartWithItems.id)" -ForegroundColor Cyan
    Write-Host "   Items: $($cartWithItems.items.Count)" -ForegroundColor Cyan
    Write-Host "   Total: $([math]::Round($cartWithItems.total.amount, 2)) $($cartWithItems.total.currency)" -ForegroundColor Cyan
    
    if ($cartWithItems.items.Count -gt 0) {
        Write-Host "   First item:" -ForegroundColor Cyan
        Write-Host "     Product ID: $($cartWithItems.items[0].productId)" -ForegroundColor Cyan
        Write-Host "     Quantity: $($cartWithItems.items[0].quantity)" -ForegroundColor Cyan
        Write-Host "     Unit Price: $($cartWithItems.items[0].unitPrice.amount) $($cartWithItems.items[0].unitPrice.currency)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "X Get cart with items failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Add another item
Write-Host ""
Write-Host "5. Testing Add Different Item..." -ForegroundColor Yellow
$addItem2Body = @{
    productId = "prod-456"
    quantity = 1
    unitPrice = @{
        amount = 15.50
        currency = "USD"
    }
} | ConvertTo-Json

try {
    $addResult2 = Invoke-RestMethod -Uri "http://localhost:3000/api/cart/test-cart-1/items" -Method POST -Body $addItem2Body -ContentType "application/json"
    Write-Host "OK Second item added successfully" -ForegroundColor Green
    Write-Host "   Message: $($addResult2.message)" -ForegroundColor Cyan
} catch {
    Write-Host "X Add second item failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Checkout cart
Write-Host ""
Write-Host "6. Testing Checkout..." -ForegroundColor Yellow
try {
    $checkoutResult = Invoke-RestMethod -Uri "http://localhost:3000/api/cart/test-cart-1/checkout" -Method POST
    Write-Host "OK Checkout successful" -ForegroundColor Green
    Write-Host "   Order ID: $($checkoutResult.orderId)" -ForegroundColor Cyan
    Write-Host "   Total: $([math]::Round($checkoutResult.total.amount, 2)) $($checkoutResult.total.currency)" -ForegroundColor Cyan
    Write-Host "   Items: $($checkoutResult.items.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "X Checkout failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Verify cart is empty after checkout
Write-Host ""
Write-Host "7. Testing Get Cart After Checkout (should be empty)..." -ForegroundColor Yellow
try {
    $emptyCart = Invoke-RestMethod -Uri "http://localhost:3000/api/cart/test-cart-1" -Method GET
    Write-Host "OK Cart after checkout retrieved" -ForegroundColor Green
    Write-Host "   Items: $($emptyCart.items.Count)" -ForegroundColor Cyan
    Write-Host "   Total: $([math]::Round($emptyCart.total.amount, 2)) $($emptyCart.total.currency)" -ForegroundColor Cyan
    
    if ($emptyCart.items.Count -eq 0) {
        Write-Host "OK Cart is empty as expected after checkout" -ForegroundColor Green
    } else {
        Write-Host "X Cart still has items after checkout" -ForegroundColor Red
    }
} catch {
    Write-Host "X Get cart after checkout failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "API testing complete!" -ForegroundColor Green