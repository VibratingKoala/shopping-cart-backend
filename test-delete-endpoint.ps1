# Test the new DELETE endpoint
Write-Host "🧪 Testing DELETE /api/cart/:sessionId/items/:itemId endpoint" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

try {
    # 1. Add items to cart
    Write-Host "1. Adding items to cart session-test..." -ForegroundColor Yellow
    
    $addItem1 = @{
        productId = "product-1"
        quantity = 2
        unitPrice = @{
            amount = 29.99
            currency = "USD"
        }
    } | ConvertTo-Json -Depth 3

    $addItem2 = @{
        productId = "product-2" 
        quantity = 1
        unitPrice = @{
            amount = 15.50
            currency = "USD"
        }
    } | ConvertTo-Json -Depth 3

    Invoke-RestMethod -Uri "$baseUrl/api/cart/session-test/items" -Method POST -Body $addItem1 -ContentType "application/json" | Out-Null
    Invoke-RestMethod -Uri "$baseUrl/api/cart/session-test/items" -Method POST -Body $addItem2 -ContentType "application/json" | Out-Null

    # 2. Get cart to verify items
    Write-Host "2. Getting cart contents..." -ForegroundColor Yellow
    $cart = Invoke-RestMethod -Uri "$baseUrl/api/cart/session-test" -Method GET
    Write-Host "   Cart has $($cart.items.Count) items" -ForegroundColor Green

    # 3. Remove one item
    Write-Host "3. Removing product-1 from cart..." -ForegroundColor Yellow
    $removeResult = Invoke-RestMethod -Uri "$baseUrl/api/cart/session-test/items/product-1" -Method DELETE
    Write-Host "   $($removeResult.message)" -ForegroundColor Green

    # 4. Verify item was removed
    Write-Host "4. Verifying item removal..." -ForegroundColor Yellow
    $updatedCart = Invoke-RestMethod -Uri "$baseUrl/api/cart/session-test" -Method GET
    Write-Host "   Cart now has $($updatedCart.items.Count) items" -ForegroundColor Green
    
    if ($updatedCart.items.Count -eq 1 -and $updatedCart.items[0].productId.value -eq "product-2") {
        Write-Host "   ✅ DELETE endpoint working correctly!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Unexpected cart state" -ForegroundColor Red
    }

    # 5. Test error cases
    Write-Host "5. Testing error cases..." -ForegroundColor Yellow
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/api/cart/session-test/items/non-existent" -Method DELETE
        Write-Host "   ❌ Should have returned error for non-existent item" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 404) {
            Write-Host "   ✅ Correctly returned 404 for non-existent item" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ Unexpected error status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
    }

    Write-Host ""
    Write-Host "🎉 DELETE endpoint tests completed!" -ForegroundColor Green

} catch {
    Write-Host "❌ Error testing DELETE endpoint: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure the server is running with 'npm run dev'" -ForegroundColor Yellow
}