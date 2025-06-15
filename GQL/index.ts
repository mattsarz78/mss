import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { PrismaClient } from './__generated__/prisma';
import { IContext } from './context';
import { AvailableTvService, AvailableTvServiceKey } from './database/availableTV';
import { CommonService, CommonServiceKey } from './database/common';
import { FootballService, FootballServiceKey } from './database/football';
import { SeasonService, SeasonServiceKey } from './database/seasonData';
import { DatabaseServices, getDatabaseServices } from './database/services';
import { WeeklyDatesService, WeeklyDatesServiceKey } from './database/weeklyDates';

dotenv.config();

const VALID_CORS_ORIGINS = process.env.VALID_CORS_ORIGINS?.split(',') ?? [];
const NODE_ENV = process.env.NODE_ENV ?? 'development';

const app = express();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const compress = compression({
  level: 9,
  threshold: 0,
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) return false;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const contentType = req.headers['content-type'] ?? '';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (contentType.includes('image/') || contentType.includes('video/')) return false;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return compression.filter(req, res);
  }
});

app.use(compress);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isValidCors(origin) || origin === undefined) {
      callback(null, true);
      return;
    }
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // Cache preflight requests for 24 hours
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

async function startServer() {
  const db = new PrismaClient({
    log: NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'minimal'
  });

  const databaseServices: Partial<DatabaseServices> = {
    [AvailableTvServiceKey]: new AvailableTvService(db),
    [FootballServiceKey]: new FootballService(db),
    [CommonServiceKey]: new CommonService(db),
    [WeeklyDatesServiceKey]: new WeeklyDatesService(db),
    [SeasonServiceKey]: new SeasonService(db)
  };
  const gqlSchema = loadSchemaSync('./schemas/*.graphql', { loaders: [new GraphQLFileLoader()] });
  const typeDefs = mergeTypeDefs([gqlSchema]);

  const resolversArray = loadFilesSync('./resolvers/**/*.resolvers.ts');
  const resolvers = mergeResolvers(resolversArray);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer<IContext>({
    typeDefs,
    resolvers,
    introspection: NODE_ENV !== 'production',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    hideSchemaDetailsFromClientErrors: true,
    persistedQueries: false, // Disable APQ for security
    cache: 'bounded'
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    expressMiddleware<IContext>(apolloServer, {
      context: async ({ req }) => Promise.resolve({ db, services: getDatabaseServices(databaseServices), request: req })
    })
  );

  // Graceful shutdown handler
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    try {
      // Stop accepting new requests
      await apolloServer.stop();
      console.log('Apollo Server stopped');

      // Close HTTP server and wait for existing requests to complete
      await new Promise<void>((resolve) => {
        httpServer.close(() => {
          console.log('HTTP server closed');
          resolve();
        });
      });

      // Disconnect from database
      await db.$disconnect();
      console.log('Database disconnected');

      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  // Register shutdown handlers for different signals
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  // Start HTTP server
  httpServer.listen(8020, () => {
    console.log(`Server is running on port 8020`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Error starting server:', (error as Error).message);
  process.exit(1);
});

const corsCache = new Map<string, boolean>();
const isValidCors: (origin: string | undefined) => boolean = (origin) => {
  if (!origin || NODE_ENV !== 'production') return true;
  if (corsCache.has(origin)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return corsCache.get(origin)!;
  }

  const isValid = VALID_CORS_ORIGINS.some((domain) => {
    const pattern = domain.replace(/\./g, '\\.').replace(/\*/g, '[a-z0-9-]*').replace(/\\/g, '\\\\');
    return new RegExp(`^${pattern}$`).test(origin);
  });

  corsCache.set(origin, isValid);
  return isValid;
};
