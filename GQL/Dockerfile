FROM node:20-bookworm-slim

WORKDIR /app
COPY . .
RUN apt-get update -y && apt-get install -y openssl
RUN npm i
RUN npm run prismaGen
RUN npm run graphQlGen
RUN npm run prismaFormat
EXPOSE 8020
CMD ["npm", "run", "start"]