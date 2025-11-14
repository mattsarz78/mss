# syntax=docker/dockerfile:1.4

# Stage 1: Build
FROM node:24-bullseye-slim AS build

ENV NODE_ENV=development
ENV CI=true
WORKDIR /app
  
# Copy package manifests and the entire source so codegen/build can run
COPY package.json pnpm-*.yaml codegen.yml ./
COPY prisma ./prisma
COPY schemas ./schemas
COPY . /app

# Install dependencies, run generators and build, then prune and save prod node_modules
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  corepack enable pnpm \
  && pnpm install --frozen-lockfile \
  && pnpm prismaGen && pnpm graphQlGen && pnpm prismaFormat \
  && pnpm run build:dist \
  && pnpm prune --prod --no-optional \
  && mv node_modules /opt/node_modules.prod

# Stage 2: Production
FROM gcr.io/distroless/nodejs24-debian13:nonroot AS production

# Final stage should NOT bake secrets into the image. Accept runtime ENV values
# (e.g. DATABASE_URL) when running the container instead of setting them at build time.
WORKDIR /app

# Copy pruned production node_modules and compiled bundle from build stage.
# Use --chown to set files to the distroless nonroot UID (65532) so the nonroot
# process can read them.
COPY --from=build --chown=65532:65532 /opt/node_modules.prod ./node_modules
COPY --from=build --chown=65532:65532 /app/dist ./dist
# COPY --from=build --chown=65532:65532 /app/__generated__ ./__generated__
# COPY --from=build --chown=65532:65532 /app/database ./database
# COPY --from=build --chown=65532:65532 /app/resolvers ./resolvers
COPY --from=build --chown=65532:65532 /app/schemas ./schemas
# COPY --from=build --chown=65532:65532 /app/utils/errorHandler.mts ./utils/errorHandler.mts
# COPY --from=build --chown=65532:65532 /app/utils/image.mts ./utils/image.mts
# COPY --from=build --chown=65532:65532 /app/staticData ./staticData
# COPY --from=build --chown=65532:65532 /app/index.mts \
#   /app/context.mts \
#   /app/tsconfig.json \
#   /app/package.json \
#   ./

# Expose the application port
EXPOSE 8020

# Distroless node images use `node` as their entrypoint; provide the script path as CMD.
CMD ["dist/index.js"]