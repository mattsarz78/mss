import type { IContext } from '#/context.mjs';
import { CommonService, CommonServiceKey } from '#database/common.mjs';
import { FootballService, FootballServiceKey } from '#database/football.mjs';
import { SeasonService, SeasonServiceKey } from '#database/seasonData.mjs';
import { type DatabaseServices } from '#database/services.mjs';
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

const corsOptions = {
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
} satisfies cors.CorsOptions;

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
  // Lazy database client and services — created only when a resolver needs them.
  let db: PrismaClient | null = null;
  let databaseServices: Partial<DatabaseServices> | null = null;

  function ensureDbAndServicesSync() {
    if (db && databaseServices) return { db, services: databaseServices };

    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL }, { schema: 'mattsarzsports' });

    db = new PrismaClient({ log: NODE_ENV === 'production' ? ['error'] : ['error'], errorFormat: 'minimal', adapter });
    process.stdout.write('Database client initialized');

    databaseServices = {
      [FootballServiceKey]: new FootballService(db),
      [CommonServiceKey]: new CommonService(db),
      [WeeklyDatesServiceKey]: new WeeklyDatesService(db),
      [SeasonServiceKey]: new SeasonService(db)
    };

    // Intentionally do NOT call db.$connect() here. The Prisma client will open
    // connections lazily when executing queries. This keeps startup fast and
    // avoids blocking the process if the DB is temporarily unavailable.

    return { db, services: databaseServices };
  }

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
      context: async ({ req }) => {
        // Provide lazy accessors so the database + services are only created when actually accessed
        const lazyDb = new Proxy({} as Record<PropertyKey, unknown>, {
          // Proxy get will initialize DB/services synchronously on first property access
          get(_target, prop) {
            // avoid triggering during JSON.stringify / util.inspect
            if (prop === 'then') return undefined;
            if (!db || !databaseServices) ensureDbAndServicesSync();
            return db?.[prop as keyof typeof db];
          }
        }) as unknown as PrismaClient;

        const lazyServices = new Proxy({} as Record<PropertyKey, unknown>, {
          get(_target, prop) {
            if (!db || !databaseServices) ensureDbAndServicesSync();
            return databaseServices?.[prop as keyof typeof databaseServices];
          }
        }) as unknown as DatabaseServices;

        return { db: lazyDb, services: lazyServices, request: req };
      }
    })
  );

  // Graceful shutdown handler
  const shutdown = async (signal: string) => {
    process.stdout.write(`\n${signal} received. Starting graceful shutdown...`);

    try {
      // Use AbortSignal.timeout (Node 26+) for shutdown timeout (10 seconds)
      const shutdownSignal = AbortSignal.timeout(10_000);
      const shutdownAbort = new AbortController();
      const abortOnShutdownTimeout = () => shutdownAbort.abort();
      shutdownSignal.addEventListener('abort', abortOnShutdownTimeout);

      try {
        await apolloServer.stop();
        process.stdout.write('Apollo Server stopped');
      } catch (err: unknown) {
        if ((err as Error).name !== 'AbortError') throw err;
        process.stdout.write('Apollo Server stop timeout - forcing close');
      }

      try {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('HTTP server close timeout'));
          }, 5000);
          httpServer.close(() => {
            clearTimeout(timeout);
            process.stdout.write('HTTP server closed');
            resolve();
          });
        });
      } catch (err: unknown) {
        process.stdout.write(`HTTP server close error: ${(err as Error).message}`);
      }

      shutdownSignal.removeEventListener('abort', abortOnShutdownTimeout);

      // Disconnect from database if initialized
      if (db) {
        try {
          await db.$disconnect();
          process.stdout.write('Database disconnected');
        } catch (err: unknown) {
          process.stdout.write(`Error disconnecting database: ${(err as Error).message}`);
        }
      }

      // Shutdown optional caches
      try {
        // lazy import to avoid loading redis client if not used
        const { shutdownCache } = await import('#utils/cache.mjs');
        await shutdownCache();
      } catch (err: unknown) {
        process.stdout.write(`Cache shutdown error: ${(err as Error).message}`);
      }

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
