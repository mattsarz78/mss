# Stage 1: Build
FROM node:22-alpine AS build

ENV NODE_ENV=development
WORKDIR /app

# Install build dependencies and clean up in the same layer
RUN apk add --no-cache openssl \
  && rm -rf /var/cache/apk/* \
  && corepack enable pnpm

# Copy only necessary files for dependency installation
COPY package.json pnpm-*.yaml ./

# Install dependencies
RUN pnpm fetch --prod \
  && pnpm i -r --offline --prod \
  && mv node_modules /opt/node_modules.prod \
  && pnpm cache delete 

# Copy the rest of the application
COPY . /app

# Generate Prisma and GraphQL files
RUN pnpm prismaGen && pnpm graphQlGen && pnpm prismaFormat

# Stage 2: Production
FROM node:22-alpine AS production

# Set runtime configuration
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ARG VALID_CORS_ORIGINS
ENV VALID_CORS_ORIGINS=$VALID_CORS_ORIGINS

WORKDIR /app

# Install minimal runtime dependencies and set up user in one layer
RUN apk add --no-cache openssl dumb-init \
  && addgroup -S appgroup \
  && adduser -S appuser -G appgroup \
  && rm -rf /var/cache/apk/* \
  && corepack enable pnpm

# Copy only the necessary files
COPY --from=build --chown=appuser:appgroup /opt/node_modules.prod ./node_modules
COPY --from=build --chown=appuser:appgroup /app/__generated__ ./__generated__
COPY --from=build --chown=appuser:appgroup /app/database ./database
COPY --from=build --chown=appuser:appgroup /app/resolvers ./resolvers
COPY --from=build --chown=appuser:appgroup /app/schemas ./schemas
COPY --from=build --chown=appuser:appgroup /app/utils/errorHandler.ts ./utils/errorHandler.ts
COPY --from=build --chown=appuser:appgroup /app/utils/image.ts ./utils/image.ts
COPY --from=build --chown=appuser:appgroup /app/staticData ./staticData
COPY --from=build --chown=appuser:appgroup /app/index.ts \
  /app/context.ts \
  /app/tsconfig.json \
  /app/package.json \
  ./

USER appuser

# Expose the application port
EXPOSE 8020

# Use dumb-init as PID 1
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start the application
CMD ["pnpm", "start"]