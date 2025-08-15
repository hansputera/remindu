import { drizzle } from 'drizzle-orm/node-postgres';
import { EnvManager } from '../utils/env-manager';
import * as schema from './schema';

export const db = drizzle({
  connection: {
    connectionString: EnvManager.getDatabaseUrl(),
  },
  schema
});