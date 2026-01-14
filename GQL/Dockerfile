# syntax=docker/dockerfile:1.4

# Stage 1: Build
FROM node:24-bullseye-slim AS build

ENV NODE_ENV=development
ENV CI=true
WORKDIR /app

# Copy dependency manifests first (cacheable layer)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/

# Install dependencies (cache hit when lockfile unchanged)
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  corepack enable pnpm \
  && pnpm install --frozen-lockfile

# Copy remaining source and run generators + build
COPY . /app

RUN pnpm prismaGen && pnpm graphQlGen && pnpm prismaFormat \
  && pnpm run build:dist \
  && pnpm prune --prod --no-optional \
  && mv node_modules /opt/node_modules.prod \
  && rm -rf /tmp/* /root/.npm

# Stage 2: Production
FROM gcr.io/distroless/nodejs24-debian13:nonroot AS production

# Final stage should NOT bake secrets into the image. Accept runtime ENV values
# (e.g. DATABASE_URL) when running the container instead of setting them at build time.
ENV NODE_ENV=production
WORKDIR /app
USER 65532
STOPSIGNAL SIGTERM

# Copy pruned production node_modules and compiled bundle from build stage.
# Use --chown to set files to the distroless nonroot UID (65532) so the nonroot
# process can read them.
COPY --from=build --chown=65532:65532 /opt/node_modules.prod ./node_modules
COPY --from=build --chown=65532:65532 /app/dist ./dist
COPY --from=build --chown=65532:65532 /app/schemas ./schemas

# Expose the application port
EXPOSE 8020

# Healthcheck using node builtin (no curl required in distroless)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "const http = require('http'); const req = http.get('http://127.0.0.1:8020/health', res => { if (res.statusCode !== 200) process.exit(1); process.exit(0); }); req.on('error', () => process.exit(1)); setTimeout(() => process.exit(1), 4500);"

# Distroless node images use `node` as their entrypoint; provide the script path as CMD.
CMD ["dist/index.js"]