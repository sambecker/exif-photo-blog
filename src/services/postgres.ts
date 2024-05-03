import { POSTGRES_SSL_ENABLED } from '@/site/config';
import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ...POSTGRES_SSL_ENABLED && { ssl: true },
});

export type Primitive = string | number | boolean | undefined | null;

export const query = async <T extends QueryResultRow = any>(
  queryString: string,
  values: Primitive[],
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

export const convertArrayToPostgresString = (array?: string[]) => array
  ? `{${array.join(',')}}`
  : null;

const isTemplateStringsArray = (
  strings: unknown,
): strings is TemplateStringsArray => {
  return (
    Array.isArray(strings) && 'raw' in strings && Array.isArray(strings.raw)
  );
};
