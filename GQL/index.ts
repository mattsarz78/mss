import express from 'express';
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
import bodyParser from 'body-parser';
import compression from 'compression';

const VALID_CORS_ORIGINS = process.env.VALID_CORS_ORIGINS?.split(',') ?? [];
const NODE_ENV = process.env.NODE_ENV ?? 'development';

const app = express();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const compress = compression({
  level: 7,
  threshold: 100,
  filter: (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.headers['x-no-compression']) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return compression.filter(req, res);
  }
});

app.use(compress);

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
    if (isValidCors(origin) || origin === undefined) {
      callback(null, true);
      return;
    }
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

async function startServer() {
  const db = new PrismaClient();

  const databaseServices: Partial<DatabaseServices> = {
    [AvailableTvServiceKey]: new AvailableTvService(db),
    [FootballServiceKey]: new FootballService(db),
    [CommonServiceKey]: new CommonService(db),
    [WeeklyDatesServiceKey]: new WeeklyDatesService(db)
  };
  const gqlSchema = loadSchemaSync('./schemas/*.graphql', { loaders: [new GraphQLFileLoader()] });
  const typeDefs = mergeTypeDefs([gqlSchema]);

  const resolversArray = loadFilesSync('./resolvers/**/*.resolvers.ts');
  const resolvers = mergeResolvers(resolversArray);

  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer<IContext>({
    typeDefs,
    resolvers,
    introspection: NODE_ENV !== 'production',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    hideSchemaDetailsFromClientErrors: true
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    expressMiddleware<IContext>(apolloServer, {
      context: async ({ req, res }) =>
        Promise.resolve({ db, services: getDatabaseServices(databaseServices), request: req, response: res })
    })
  );

  httpServer.listen(8020, () => {
    console.log(`Server is running`);
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on('SIGTERM', async () => {
    await db.$disconnect();
    httpServer.close(() => {
      console.log('Server closed');
    });
  });
}

startServer().catch((error: unknown) => {
  console.error('Error starting server:', (error as Error).message);
  process.exit(1);
});

const isValidCors: (origin: string | undefined) => boolean = (origin) => {
  if (NODE_ENV === 'production') {
    return (
      !!origin &&
      Array.isArray(VALID_CORS_ORIGINS) &&
      VALID_CORS_ORIGINS.some((domain) => {
        const regexPattern = `^${domain.replace(/\\/g, '\\\\').replace(/\*/g, '[a-z0-9-]*').replace(/\./g, '\\.')}$`;
        const regex = new RegExp(regexPattern);
        return regex.test(origin);
      })
    );
  } else {
    return true;
  }
};
