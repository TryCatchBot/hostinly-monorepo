FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./

# Copy libraries (needed for build)
COPY libs ./libs

# Copy the backend app
COPY apps/hostinly-backend ./apps/hostinly-backend

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the backend using Nx
RUN pnpm nx build hostinly-backend --prod

FROM node:20-alpine AS runner

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/apps/hostinly-backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

CMD ["node", "dist/main.js"]
