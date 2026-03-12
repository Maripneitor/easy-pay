FROM node:20-alpine

RUN apk add --no-cache git bash

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY apps/mobile-app/package.json ./apps/mobile-app/
COPY packages/domain/package.json ./packages/domain/
COPY packages/ui/package.json ./packages/ui/

# Habilitamos corepack para manejar pnpm de forma nativa
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install

COPY . .

# Build domain and ui just in case
RUN cd packages/domain && pnpm run build || true
RUN cd packages/ui && pnpm run build || true

EXPOSE 8081

CMD ["npx", "expo", "start", "--web"]
