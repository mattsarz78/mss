import type { IContext } from '#/context.mjs';
import { AvailableTvService, AvailableTvServiceKey } from '#database/availableTV.mjs';
import { CommonService, CommonServiceKey } from '#database/common.mjs';
import { FootballService, FootballServiceKey } from '#database/football.mjs';
import { SeasonService, SeasonServiceKey } from '#database/seasonData.mjs';
import { type DatabaseServices, getDatabaseServices } from '#database/services.mjs';
import { WeeklyDatesService, WeeklyDatesServiceKey } from '#database/weeklyDates.mjs';
import { PrismaClient } from '#generated/prisma/client.mjs';
import * as Resolvers from '#resolvers/index.mjs';
import { SCHEMA_GLOB } from '#staticData/constants.mjs';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginCacheControlDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import dotenvx from '@dotenvx/dotenvx';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { PrismaPg } from '@prisma/adapter-pg';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import http from 'http';

dotenvx.config({ ignore: ['MISSING_ENV_FILE'] });

const VALID_CORS_ORIGINS = process.env.VALID_CORS_ORIGINS?.split(',') ?? [];
const NODE_ENV = process.env.NODE_ENV ?? 'development';

const app = express();

const compress = compression({
  level: 9,
  threshold: 0,
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) return false;
    const contentType = req.headers['content-type'] ?? '';
    if (contentType.includes('image/') || contentType.includes('video/')) return false;
    return compression.filter(req, res);
  }
});

const corsPatterns = VALID_CORS_ORIGINS.map(
  (domain) => new RegExp(`^${domain.replace(/\\/g, '\\\\').replace(/\*/g, '[a-z0-9-]*').replace(/\./g, '\\.')}$`)
);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isValidCors(origin) || origin === undefined) {
      callback(null, true);
      return;
    }
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  optionsSuccessStatus: 200,
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
};

const loadSchemaAndResolvers = () => {
  const gqlSchema = loadSchemaSync(SCHEMA_GLOB, { loaders: [new GraphQLFileLoader()] });
  const resolversArray = createResolversArray();

  const typeDefs = mergeTypeDefs([gqlSchema]);
  const resolvers = mergeResolvers(resolversArray);

  return { typeDefs, resolvers };
};

const createResolversArray = () => {
  return {
    Query: {
      ...Resolvers.AvailableTv,
      ...Resolvers.ConferenceGames,
      ...Resolvers.NoTvGames,
      ...Resolvers.Health,
      ...Resolvers.SeasonContents,
      ...Resolvers.SeasonData,
      ...Resolvers.DailyTvGames,
      ...Resolvers.TvGames
    }
  };
};

const startServer = async () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL }, { schema: 'mattsarzsports' });

  const db = new PrismaClient({
    log: NODE_ENV === 'production' ? ['error'] : ['error'],
    errorFormat: 'minimal',
    adapter
  });

  const databaseServices: Partial<DatabaseServices> = {
    [AvailableTvServiceKey]: new AvailableTvService(db),
    [FootballServiceKey]: new FootballService(db),
    [CommonServiceKey]: new CommonService(db),
    [WeeklyDatesServiceKey]: new WeeklyDatesService(db),
    [SeasonServiceKey]: new SeasonService(db)
  };

  const { typeDefs, resolvers } = loadSchemaAndResolvers();

  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer<IContext>({
    typeDefs,
    resolvers,
    introspection: NODE_ENV !== 'production',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginCacheControlDisabled()],
    hideSchemaDetailsFromClientErrors: true,
    persistedQueries: false,
    cache: 'bounded'
  });

  await apolloServer.start();

  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  app.use(
    '/graphql',
    compress,
    bodyParser.json({ limit: '1mb' }),
    cors(corsOptions),
    expressMiddleware<IContext>(apolloServer, {
      context: async ({ req }) => Promise.resolve({ db, services: getDatabaseServices(databaseServices), request: req })
    })
  );

  // Graceful shutdown handler
  const shutdown = async (signal: string) => {
    process.stdout.write(`\n${signal} received. Starting graceful shutdown...`);

    try {
      await apolloServer.stop();
      process.stdout.write('Apollo Server stopped');

      await new Promise<void>((resolve) => {
        httpServer.close(() => {
          process.stdout.write('HTTP server closed');
          resolve();
        });
      });

      // Disconnect from database
      await db.$disconnect();
      process.stdout.write('Database disconnected');

      process.stdout.write('Graceful shutdown completed');
      process.exit(0);
    } catch (error: unknown) {
      process.stdout.write(`Error during shutdown: ${(error as Error).message}`);
      process.exit(1);
    }
  };

  // Register shutdown handlers for different signals
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  // Start HTTP server
  httpServer.listen(8020, () => {
    process.stdout.write(`Server is running on port 8020`);
  });
};

startServer().catch((error: unknown) => {
  process.stdout.write(`Error starting server: ${(error as Error).message}`);
  process.exit(1);
});

const corsCache = new Map<string, boolean>();
const isValidCors = (origin: string | undefined): boolean => {
  if (!origin || NODE_ENV !== 'production') return true;
  if (corsCache.has(origin)) return corsCache.get(origin) ?? false;

  const isValid = corsPatterns.some((pattern) => pattern.test(origin));
  corsCache.set(origin, isValid);
  return isValid;
};
