# infra/docker/prod/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

FROM node:20-alpine AS production
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs
WORKDIR /app

# Install only production dependencies in the final stage
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --chown=nodejs:nodejs package.json ./
USER nodejs
EXPOSE 3000
CMD ["node", "dist/infrastructure/server.js"]
