# Dockerfile for Next.js app

# 1. Install dependencies
FROM node:24-alpine AS deps
WORKDIR /app

# Enable pnpm
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

COPY package.json pnpm-lock.yaml* ./
RUN pnpm fetch
RUN pnpm install --frozen-lockfile

# 2. Build the app
FROM node:24-alpine AS builder
WORKDIR /app

# Enable pnpm
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# Copy .env.example as .env for build-time environment variables
COPY .env.example .env

# Copy all dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files and configs
COPY package.json pnpm-lock.yaml* ./
COPY next.config.ts ./
COPY tsconfig.json ./
COPY tailwind.css ./
COPY postcss.config.js ./
COPY eslint.config.mjs ./
COPY jest.config.ts ./
COPY jest.setup.ts ./
COPY middleware.ts ./
COPY next-env.d.ts ./
COPY app/ ./app/
COPY src/ ./src/
COPY public/ ./public/

# Build the application
RUN pnpm build

# Verify build was successful
RUN ls -la .next/

# 3. Run the app
FROM node:24-alpine AS runner
WORKDIR /app

# Enable pnpm
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Change ownership to a non-root user
RUN addgroup --system --gid 1005 nodejs
RUN adduser --system --uid 1005 nextjs
RUN chown -R nextjs:nodejs /app/.next /app/node_modules
USER nextjs

EXPOSE 3000

CMD ["pnpm", "start"]
