FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Brute force environment settings
ENV NX_DAEMON=false
ENV CI=true
RUN pnpm config set only-allow-trusted-dependencies false
RUN pnpm config set node-linker hoisted

# Brute force: Copy EVERYTHING to ensure no missing config files or dependencies
COPY . .

# Install dependencies with hoisted linker to avoid symlink issues in runner stage
RUN pnpm install --frozen-lockfile --config.node-linker=hoisted

# Generate Prisma Client for the correct platform (linux-musl)
RUN pnpm exec prisma generate --schema=apps/hostinly-backend/prisma/schema.prisma

# Build the backend - skipping cache and identifying exact target
RUN pnpm nx build hostinly-backend --prod --skip-nx-cache

FROM node:20-alpine AS runner

WORKDIR /app

# Copy built assets from builder
# Nx usually builds to apps/hostinly-backend/dist based on the project config
COPY --from=builder /app/apps/hostinly-backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

CMD ["node", "dist/main.js"]
