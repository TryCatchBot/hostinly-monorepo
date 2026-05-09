FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy monorepo config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json eslint.config.mjs ./

# Copy shared libraries
COPY libs ./libs

# Copy the admin app
COPY apps/hostinly-admin ./apps/hostinly-admin

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the admin app
ARG NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3333/api
ENV NEXT_PUBLIC_ADMIN_API_URL=$NEXT_PUBLIC_ADMIN_API_URL

RUN pnpm nx build hostinly-admin

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy next.js build output
COPY --from=builder /app/apps/hostinly-admin/public ./public
COPY --from=builder /app/apps/hostinly-admin/.next/standalone ./
COPY --from=builder /app/apps/hostinly-admin/.next/static ./.next/static

EXPOSE 3001

CMD ["node", "server.js"]
