type DBType = "postgresql" | "mysql" | "sqlite";

export class EnvManager {
  
  static getVar(key: string, required: boolean = true): string | undefined {
    const value = process.env[key] ?? Bun.env[key];
    if (!value && required) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  static getDatabaseUrl(): string {
    const dbConn = this.getVar("DB_CONNECTION", true) as DBType;

    // Runtime check to ensure it's valid
    const allowedTypes: DBType[] = ["postgresql", "mysql", "sqlite"];
    if (!allowedTypes.includes(dbConn)) {
      throw new Error(`Invalid DB_CONNECTION: "${dbConn}". Must be one of ${allowedTypes.join(", ")}.`);
    }

    const dbUser = this.getVar("DB_USERNAME", true);
    const dbPassword = this.getVar("DB_PASSWORD", true);
    const dbHost = this.getVar("DB_HOST", true);
    const dbPort = this.getVar("DB_PORT", true);
    const dbName = this.getVar("DB_DATABASE", true);

    return `${dbConn}://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
  }

  static getPort(): number {
    const val = this.getVar("PORT", false) ?? "3000";
    return parseInt(val, 10);
  }

  static getJWTSecret(): string {
    const val = this.getVar("JWT_SECRET", true);
    if (!val) {
      throw new Error("Missing required environment variable: JWT_SECRET");
    }
    return val;
  }
  
  static getJWTExpired(): string {
    const val: string = this.getVar("JWT_EXPIRED", false) ?? "1h";
    return val;
  }
  
}