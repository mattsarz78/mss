import dotenvx from '@dotenvx/dotenvx';
import { defineConfig, env } from 'prisma/config';

dotenvx.config({ ignore: ['MISSING_ENV_FILE'] });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url: env('DATABASE_URL') },
  typedSql: { path: 'prisma/sql' }
});
