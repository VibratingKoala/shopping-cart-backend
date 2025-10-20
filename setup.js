#!/usr/bin/env node

/**
 * Setup script for the Shopping Cart Backend project
 * Handles PowerShell execution policy and dependency installation
 */

const { execSync } = require('node:child_process');
const path = require('node:path');

console.log('🛒 Shopping Cart Backend Setup');
console.log('================================\n');

try {
  // Check if we're on Windows and handle PowerShell execution policy
  if (process.platform === 'win32') {
    console.log('📋 Checking PowerShell execution policy...');
    try {
      execSync('powershell -Command "Get-ExecutionPolicy"', { stdio: 'pipe' });
    } catch (policyError) {
      console.log('⚠️  PowerShell execution policy may be restricted.');
      console.log('   Please run this command in an Administrator PowerShell:');
      console.log('   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser\n');
      // Log the specific error for debugging
      console.log('   Policy check error:', policyError.message);
    }
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });

  console.log('\n✅ Setup completed successfully!\n');

  console.log('🚀 Quick Start Commands:');
  console.log('  npm test              # Run tests');
  console.log('  npm run test:coverage # Run tests with coverage');
  console.log('  npm run lint          # Run linter');
  console.log('  npm run build         # Build for production');
  console.log('  npm run dev           # Start development server');
  console.log('  npm start             # Start production server\n');

  console.log('🐋 Docker Commands:');
  console.log('  docker build -f infra/docker/prod/Dockerfile -t shopping-cart-api .');
  console.log('  docker run -p 3000:3000 shopping-cart-api\n');

  console.log('📚 API Endpoints (when server is running):');
  console.log('  GET  http://localhost:3000/health');
  console.log('  POST http://localhost:3000/api/carts/:cartId/items');
  console.log('  GET  http://localhost:3000/api/carts/:cartId');
  console.log('  POST http://localhost:3000/api/carts/:cartId/checkout\n');

  console.log('🎯 Next Steps:');
  console.log('  1. Run "npm test" to verify everything works');
  console.log('  2. Run "npm run dev" to start the development server');
  console.log('  3. Test the API endpoints with curl or Postman');
  console.log('  4. Check the README.md for more information\n');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.log('\n🔧 Manual Setup:');
  console.log('  1. Ensure Node.js 18+ is installed');
  console.log('  2. Run: npm install');
  console.log('  3. Run: npm test');
  process.exit(1);
}