import 'server-only';
import sql from 'mssql';

export type SqlServerConfig = {
  server: string;
  port: number;
  database: string;
  user: string;
  password: string;
  encrypt: boolean;
  trustServerCertificate: boolean;
};

let pool: sql.ConnectionPool | null = null;
let poolPromise: Promise<sql.ConnectionPool> | null = null;

export function isSqlServerConfigured(): boolean {
  return Boolean(
    process.env.SQLSERVER_HOST?.trim() &&
      process.env.SQLSERVER_DATABASE?.trim() &&
      process.env.SQLSERVER_USERNAME?.trim() &&
      process.env.SQLSERVER_PASSWORD,
  );
}

export function getSqlServerConfig(): SqlServerConfig | null {
  if (!isSqlServerConfigured()) return null;

  return {
    server: process.env.SQLSERVER_HOST!.trim(),
    port: parseInt(process.env.SQLSERVER_PORT || '1433', 10),
    database: process.env.SQLSERVER_DATABASE!.trim(),
    user: process.env.SQLSERVER_USERNAME!.trim(),
    password: process.env.SQLSERVER_PASSWORD!,
    encrypt: process.env.SQLSERVER_ENCRYPT === 'true',
    trustServerCertificate: process.env.SQLSERVER_TRUST_CERT !== 'false',
  };
}

export async function getSqlServerPool(): Promise<sql.ConnectionPool> {
  const config = getSqlServerConfig();
  if (!config) {
    throw new Error('SQL Server is not configured (SQLSERVER_* in .env)');
  }

  if (pool?.connected) return pool;

  if (!poolPromise) {
    const mssqlConfig: sql.config = {
      server: config.server,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      options: {
        encrypt: config.encrypt,
        trustServerCertificate: config.trustServerCertificate,
      },
      pool: { max: 5, min: 0, idleTimeoutMillis: 30_000 },
      connectionTimeout: 15_000,
      requestTimeout: 30_000,
    };
    poolPromise = sql.connect(mssqlConfig).then((connected) => {
      pool = connected;
      return connected;
    });
  }

  return poolPromise;
}
