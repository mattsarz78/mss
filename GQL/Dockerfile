# Stage 1: Build
FROM node:22.14.0-bookworm-slim AS build

ENV NODE_ENV=development
WORKDIR /app

# Install dependencies and tools
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy package files first to leverage Docker cache
COPY ./package.json ./package-lock.json /app/

# Install dependencies
RUN npm ci --omit=dev \
  && mv node_modules /opt/node_modules.prod \
  && npm ci \
  && npm cache clean --force

# Copy the rest of the application
COPY . /app

# Generate Prisma and GraphQL files
RUN npm run prismaGen && npm run graphQlGen && npm run prismaFormat

# Stage 2: Production
FROM node:22.14.0-bookworm-slim AS production

# Set environment variables
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV=production

WORKDIR /app

# Install openssl and clean up
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy production dependencies and application files
COPY --from=build /opt/node_modules.prod ./node_modules
COPY --from=build /app/__generated__ ./__generated__
COPY --from=build /app/database ./database
COPY --from=build /app/resolvers ./resolvers
COPY --from=build /app/schemas ./schemas
COPY --from=build /app/utils ./utils
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/index.ts ./index.ts
COPY --from=build /app/context.ts ./context.ts

# Expose the application port
EXPOSE 8020

# Start the application
CMD ["npm", "run", "start"]