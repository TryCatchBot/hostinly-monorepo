FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Brute force environment settings
ENV NX_DAEMON=false
ENV CI=true

# Brute force: Copy EVERYTHING to ensure no missing config files or dependencies
COPY . .

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Generate Prisma Client for the correct platform (linux-musl)
RUN pnpm exec prisma generate --schema=apps/hostinly-backend/prisma/schema.prisma

# Build the backend - skipping cache and identifying exact target
RUN pnpm nx build hostinly-backend --prod --skip-nx-cache

FROM node:20-alpine AS runner

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/apps/hostinly-backend/dist ./dist
COPY --from=builder /app/apps/hostinly-backend/src/generated/client ./apps/hostinly-backend/src/generated/client
# Also copy engines to dist for esbuild bundled output to find them
RUN cp /app/apps/hostinly-backend/src/generated/client/libquery_engine-linux-musl-openssl-3.0.x.so.node ./dist/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

CMD ["node", "dist/main.js"]
