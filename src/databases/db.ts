import { drizzle } from 'drizzle-orm/node-postgres';

const getDatabaseUrl = () => {
  const dbConn = Bun.env.DB_CONNECTION;
  const dbUser = Bun.env.DB_USERNAME;
  const dbPassword = Bun.env.DB_PASSWORD;
  const dbHost = Bun.env.DB_HOST;
  const dbPort = Bun.env.DB_PORT;
  const dbName = Bun.env.DB_DATABASE;
  
  return `${dbConn}://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
};

export const db = drizzle({ 
  connection: { 
    connectionString: getDatabaseUrl(),
    ssl: true
  }
});