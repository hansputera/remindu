import { Config, defineConfig } from 'drizzle-kit';
import { EnvManager } from './src/utils/env-manager';

const dialect = (EnvManager.getVar('DB_CONNECTION', true) ?? 'sqlite') as Config['dialect'];

export default defineConfig({
  out: './drizzle',
  schema: './src/databases/schema.ts',
  dialect,
  dbCredentials: {
    url: EnvManager.getDatabaseUrl(),
  },
});