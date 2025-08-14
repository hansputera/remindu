import { drizzle } from 'drizzle-orm/node-postgres';
import { EnvManager } from '../utils/env-manager';

export const db = drizzle({ 
  connection: { 
    connectionString: EnvManager.getDatabaseUrl(),
    // ssl: true
  }
});