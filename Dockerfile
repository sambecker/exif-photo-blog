# Multi-stage optimized Dockerfile for Next.js app with standalone output

# 1. Dependencies stage - only production deps
FROM node:24-alpine AS deps
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install only production dependencies and clean cache
RUN pnpm fetch --prod && \
    pnpm install --prod --frozen-lockfile && \
    pnpm store prune && \
    rm -rf /root/.local/share/pnpm

# 2. Build stage
FROM node:24-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy package files and install all dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Remove unnecessary files during build
RUN rm -rf __tests__ readme .git* docker-compose* Dockerfile* && \
    rm -rf jest.* eslint.* .env.local .env.development

# Set build environment variables to prevent URL errors during build
ENV NODE_ENV=production
# PUBLIC_DOMAIN is used in the stage of building the application
ENV NEXT_PUBLIC_DOMAIN=https://photos.alicepatience.com
ENV NEXT_PUBLIC_GRID_ASPECT_RATIO=1.5
ENV NEXT_PUBLIC_ALLOW_PUBLIC_DOWNLOADS=1
# not sure
ENV NEXT_PUBLIC_HIDE_REPO_LINK=1
ENV NEXT_PUBLIC_SITE_FEEDS=1
# dynamic environment variables
ENV VERCEL_ENV=production
ENV NEXT_PUBLIC_VERCEL_ENV=production
ENV VERCEL_PRODUCTION_URL=localhost:3000
ENV VERCEL_PROJECT_PRODUCTION_URL=localhost:3000
ENV VERCEL_DEPLOYMENT_URL=localhost:3000
ENV VERCEL_BRANCH_URL=localhost:3000
ENV NEXT_PUBLIC_VERCEL_URL=localhost:3000
ENV NEXT_PUBLIC_VERCEL_BRANCH_URL=localhost:3000
ENV AUTH_TRUST_HOST=true
ENV IS_SITE_READY=true
ENV AUTH_SECRET=mock_auth_secret_for_build
ENV POSTGRES_URL=postgres://mock:mock@localhost:5432/mock
ENV BLOB_READ_WRITE_TOKEN=mock_blob_token

# Build the application
RUN pnpm build

# 3. Runtime stage - minimal Alpine image
FROM node:24-alpine AS runner
WORKDIR /app

# Install only dumb-init for proper signal handling
RUN apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone build output (includes minimal node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
