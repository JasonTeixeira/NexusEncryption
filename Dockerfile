# Multi-stage build for Nexus Encryption
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build
RUN npm run export

# Production image, copy all the files and run next
FROM nginx:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the static files
COPY --from=builder /app/out ./out
COPY nginx.conf /etc/nginx/nginx.conf

# Set the correct permission for the app directory
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 80

ENV PORT 80
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["nginx", "-g", "daemon off;"]


