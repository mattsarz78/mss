import dotenvx from '@dotenvx/dotenvx';
import { defineConfig as definePostgresConfig } from '@prisma/orm-postgres/config';
import { definePrismaConfig } from 'prisma/config';

dotenvx.config({ ignore: ['MISSING_ENV_FILE'] });

export default definePrismaConfig({
  orm: definePostgresConfig({
    contract: './prisma/contract.prisma',
    output: './__generated__/prisma',
    db: { connection: process.env['DATABASE_URL']! }
  })
});
