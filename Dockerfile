# syntax=docker/dockerfile:1

FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build


FROM node:18-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built app
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start:prod"]