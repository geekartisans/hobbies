FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/

RUN npm ci

COPY apps/backend ./apps/backend
COPY apps/frontend ./apps/frontend

WORKDIR /app/apps/frontend
RUN npm run build

WORKDIR /app/apps/backend
RUN npm run build

FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/backend/package*.json ./apps/backend/

RUN npm ci --only=production --workspace=apps/backend

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist

COPY --from=builder /app/apps/backend/prisma/migrations ./apps/backend/prisma/migrations

ENV NODE_ENV=production

EXPOSE 3000

CMD cd apps/backend && npx prisma migrate deploy --config prisma/prisma.config.ts && node dist/src/main.js