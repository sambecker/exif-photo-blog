import { POSTGRES_SSL_ENABLED } from '@/app/config';
import { removeParamsFromUrl } from '@/utility/url';
import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  ...process.env.POSTGRES_URL && {
    connectionString: removeParamsFromUrl(
      process.env.POSTGRES_URL,
      ['sslmode'],
    ),
  },
  ...POSTGRES_SSL_ENABLED && { ssl: true },
  // Serverless functions each hold their own pool; keep it small so
  // concurrent invocations don't exhaust database connections
  max: 5,
  // Recycle idle clients before the provider closes them server-side
  idleTimeoutMillis: 30_000,
  // Fail fast instead of hanging until the platform request timeout
  connectionTimeoutMillis: 10_000,
});

// Without an 'error' listener, a connection terminated by the database
// provider (e.g. Neon suspending compute) is an unhandled event that
// takes down the whole Node process
pool.on('error', error => {
  console.error('Postgres pool error', { error });
});

export type Primitive = string | number | boolean | undefined | null;

export const query = async <T extends QueryResultRow = any>(
  queryString: string,
  values: Primitive[] = [],
) => {
  const client = await pool.connect();
  let response: QueryResult<T>;
  try {
    response = await client.query<T>(queryString, values);
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
  return response;
};

export const sql = <T extends QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: Primitive[]
) => {
  if (!isTemplateStringsArray(strings) || !Array.isArray(values)) {
    throw new Error('Invalid template literal argument');
  }

  let result = strings[0] ?? '';

  for (let i = 1; i < strings.length; i++) {
    result += `$${i}${strings[i] ?? ''}`;
  }

  return query<T>(result, values);
};

const isTemplateStringsArray = (
  strings: unknown,
): strings is TemplateStringsArray => {
  return (
    Array.isArray(strings) && 'raw' in strings && Array.isArray(strings.raw)
  );
};

export const testDatabaseConnection = async () =>
  query('SELECt COUNT(*) FROM pg_stat_user_tables');
