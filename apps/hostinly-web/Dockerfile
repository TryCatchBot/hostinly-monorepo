FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy monorepo config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json eslint.config.mjs ./

# Copy shared libraries
COPY libs ./libs

# Copy the web app
COPY apps/hostinly-web ./apps/hostinly-web

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the web app
# Note: Next.js build needs API URL at build time for some optimizations
ARG NEXT_PUBLIC_API_URL=http://localhost:3333/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm nx build hostinly-web

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy next.js build output
COPY --from=builder /app/apps/hostinly-web/public ./public
COPY --from=builder /app/apps/hostinly-web/.next/standalone ./
COPY --from=builder /app/apps/hostinly-web/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
