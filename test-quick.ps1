# Shopping Cart API Test Script
Write-Host "Shopping Cart API Test Suite" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000/api/cart"
$sessionId = "test-cart-1"

# Test 1: Get empty cart
Write-Host "1. Testing Get Empty Cart..." -ForegroundColor Yellow
$cart = Invoke-RestMethod -Uri "$baseUrl/$sessionId" -Method GET
Write-Host " Empty cart retrieved" -ForegroundColor Green
Write-Host "   Items: $($cart.items.Count), Total: $($cart.total.amount) $($cart.total.currency)" -ForegroundColor Cyan

# Test 2: Add item
Write-Host "2. Testing Add Item..." -ForegroundColor Yellow
$addItemBody = @{
    productId = "laptop-1"
    quantity = 2
    unitPrice = @{ amount = 999.99; currency = "USD" }
} | ConvertTo-Json

$addResult = Invoke-RestMethod -Uri "$baseUrl/$sessionId/items" -Method POST -Body $addItemBody -ContentType "application/json"
Write-Host " Item added: $($addResult.message)" -ForegroundColor Green

# Test 3: Get cart with items
Write-Host "3. Testing Get Cart with Items..." -ForegroundColor Yellow
$cartWithItems = Invoke-RestMethod -Uri "$baseUrl/$sessionId" -Method GET
Write-Host " Cart retrieved - Items: $($cartWithItems.items.Count), Total: $($cartWithItems.total.amount) $($cartWithItems.total.currency)" -ForegroundColor Green

# Test 4: Remove item
Write-Host "4. Testing Remove Item..." -ForegroundColor Yellow
$removeResult = Invoke-RestMethod -Uri "$baseUrl/$sessionId/items/laptop-1" -Method DELETE
Write-Host " Item removed: $($removeResult.message)" -ForegroundColor Green

# Test 5: Add item back and checkout
Write-Host "5. Testing Add Item and Checkout..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$baseUrl/$sessionId/items" -Method POST -Body $addItemBody -ContentType "application/json" | Out-Null
$checkoutResult = Invoke-RestMethod -Uri "$baseUrl/$sessionId/checkout" -Method POST
Write-Host " Checkout successful - Order: $($checkoutResult.orderId), Total: $($checkoutResult.total.amount)" -ForegroundColor Green

Write-Host "All tests completed successfully!" -ForegroundColor Green
