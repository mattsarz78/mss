FROM node:22.14.0-bookworm-slim AS build

ENV NODE_ENV=development
WORKDIR /app

USER root

# Install openssl
RUN apt-get update -y && apt-get install -y openssl

# Copy package.json and package-lock.json first to leverage Docker cache
COPY ./package.json /app
COPY ./package-lock.json /app

RUN npm ci --omit=dev \
&& mv node_modules /opt/node_modules.prod \
&& npm ci \
&& npm cache clean --force

COPY . /app

RUN npm run prismaGen
RUN npm run graphQlGen
RUN npm run prismaFormat

FROM node:22.14.0-bookworm-slim AS production

ARG DATABASE_URL
ARG NODE_ENV

EXPOSE 8020

ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV=production

USER root

# Install openssl
RUN apt-get update -y && apt-get install -y openssl && apt-get clean && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
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

CMD ["npm", "run", "start"]