FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Brute force environment settings
ENV NX_DAEMON=false
ENV CI=true
RUN pnpm config set only-allow-trusted-dependencies false

# Brute force: Copy EVERYTHING to ensure no missing config files or dependencies
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the admin app
ARG NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3333/api
ENV NEXT_PUBLIC_ADMIN_API_URL=$NEXT_PUBLIC_ADMIN_API_URL

RUN pnpm nx build hostinly-admin --prod --skip-nx-cache

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy next.js build output from standalone folder
COPY --from=builder /app/apps/hostinly-admin/public ./public
COPY --from=builder /app/apps/hostinly-admin/.next/standalone ./
COPY --from=builder /app/apps/hostinly-admin/.next/static ./.next/static

EXPOSE 3001

CMD ["node", "server.js"]
