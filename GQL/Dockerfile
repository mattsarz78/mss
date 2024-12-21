FROM node:20-bookworm-slim AS build

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./
RUN npm i

COPY . .

# Install openssl
RUN apt-get update -y && apt-get install -y openssl

RUN npm run prismaGen
RUN npm run graphQlGen
RUN npm run prismaFormat

FROM node:20-bookworm-slim

WORKDIR /app
# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./
RUN npm i --only=production

COPY --from=build /app /app
# Install openssl
RUN apt-get update -y && apt-get install -y openssl && apt-get clean && rm -rf /var/lib/apt/lists/*

EXPOSE 8020
CMD ["npm", "run", "start"]