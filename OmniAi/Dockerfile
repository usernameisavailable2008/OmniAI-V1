# Multi-stage Docker build for OmniAI
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment variables
ARG SHOPIFY_API_KEY
ARG SHOPIFY_API_SECRET
ARG SHOPIFY_APP_URL
ARG OPENAI_API_KEY
ARG SESSION_SECRET
ARG NODE_ENV=production

ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
ENV SHOPIFY_API_SECRET=$SHOPIFY_API_SECRET
ENV SHOPIFY_APP_URL=$SHOPIFY_APP_URL
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV SESSION_SECRET=$SESSION_SECRET
ENV NODE_ENV=$NODE_ENV

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remix

# Copy built application
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Create logs directory
RUN mkdir -p logs && chown -R remix:nodejs logs

# Switch to non-root user
USER remix

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"] 