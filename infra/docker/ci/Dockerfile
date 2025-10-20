# CI Dockerfile optimized for testing and building
FROM node:20-alpine AS base

# Install dumb-init and other utilities needed for CI
RUN apk add --no-cache dumb-init git

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including dev dependencies for testing)
RUN npm ci --include=dev && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app
USER nodejs

# Default stage for running tests
FROM base AS test
CMD ["npm", "run", "test:coverage"]

# Stage for linting
FROM base AS lint
CMD ["npm", "run", "lint"]

# Stage for building
FROM base AS build
CMD ["npm", "run", "build"]

# Verification stage that runs all checks
FROM base AS verify
RUN npm run lint && \
    npm run test:coverage && \
    npm run build

# Final stage that includes everything for CI pipeline
FROM base AS ci
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npm run lint && npm run test:coverage && npm run build"]