# Base stage - common dependencies
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies for sharp (image optimization) and pnpm
RUN apk add --no-cache libc6-compat
# Install pnpm version 7 which is compatible with lockfileVersion 6.0
RUN npm install -g pnpm@7

# Dependencies stage  
FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc* ./
# Set pnpm configuration to match lockfile settings
RUN pnpm config set auto-install-peers true
RUN pnpm install --frozen-lockfile --prod && cp -R node_modules /prod_node_modules
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "run", "dev"]

# Build stage
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Install wget for health checks
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy production dependencies
COPY --from=deps --chown=nextjs:nodejs /prod_node_modules ./node_modules

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"] 