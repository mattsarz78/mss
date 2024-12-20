import express, { json, type Request } from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import { PrismaClient } from './__generated__/prisma';
import { DatabaseServices, getDatabaseServices } from './database/services';
import { AvailableTvService, AvailableTvServiceKey } from './database/availableTV';
import { IContext } from './context';
import { FootballService, FootballServiceKey } from './database/football';
import { WeeklyDatesService, WeeklyDatesServiceKey } from './database/weeklyDates';
import { CommonService, CommonServiceKey } from './database/common';
import { RsnListService, RsnListServiceKey } from './database/rsnList';

const app = express();

app.use(cors({ origin: '*' }));

app.use(json());

async function startServer() {
  const db = new PrismaClient();

  const databaseServices: Partial<DatabaseServices> = {
    [AvailableTvServiceKey]: new AvailableTvService(db),
    [FootballServiceKey]: new FootballService(db),
    [CommonServiceKey]: new CommonService(db),
    [WeeklyDatesServiceKey]: new WeeklyDatesService(db),
    [RsnListServiceKey]: new RsnListService(db)
  };
  const gqlSchema = loadSchemaSync('./schemas/*.graphql', {
    loaders: [new GraphQLFileLoader()]
  });
  const typeDefs = mergeTypeDefs([gqlSchema]);

  const resolversArray = loadFilesSync('./resolvers/**/*.resolvers.ts');
  const resolvers = mergeResolvers(resolversArray);

  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer<IContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    hideSchemaDetailsFromClientErrors: true
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    expressMiddleware<IContext>(apolloServer, {
      context: async ({ req }) => ({
        db,
        services: getDatabaseServices(databaseServices),
        request: req as Request
      })
    })
  );

  httpServer.listen(8020, () => {
    console.log(`Server is running on http://localhost:8020/graphql`);
  });

  process.on('SIGTERM', () => {
    httpServer.close(() => {
      console.log('Server closed');
    });
  });
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
