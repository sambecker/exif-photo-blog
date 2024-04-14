import {
  db,
  sql as sqlVercel,
  QueryResultRow,
  QueryResult,
  createPool,
} from '@vercel/postgres';
import { DATABASE_PREFERENCE } from '@/site/config';

export type DatabaseProvider =
  'vercel' |
  'supabase';

export type Primitive = string | number | boolean | undefined | null;

const querySupabaseConnectionPool = async <T extends QueryResultRow>(
  query: string,
  values: Primitive[],
) => {
  const client = createPool({
    // eslint-disable-next-line max-len
    connectionString: `${process.env.POSTGRES_URL}?workaround=supabase-pooler.vercel`,
  });
  const connection = await client.connect();
  const result = await client.query<T>(query, values);
  connection.release();
  await client.end();
  return result;
};

export const convertArrayToPostgresString = (array?: string[]) => array
  ? `{${array.join(',')}}`
  : null;

const sqlSupabase = async <T extends QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: Primitive[]
): Promise<QueryResult<T>> => {
  const [query, params] = sqlTemplate(strings, ...values);
  return querySupabaseConnectionPool(query, params);
};

const sqlTemplate = (
  strings: TemplateStringsArray,
  ...values: Primitive[]
): [string, Primitive[]] => {
  if (!isTemplateStringsArray(strings) || !Array.isArray(values)) {
    throw new Error('Invalid template literal argument');
  }

  let result = strings[0] ?? '';

  for (let i = 1; i < strings.length; i++) {
    result += `$${i}${strings[i] ?? ''}`;
  }

  return [result, values];
};

const isTemplateStringsArray = (
  strings: unknown,
): strings is TemplateStringsArray => {
  return (
    Array.isArray(strings) && 'raw' in strings && Array.isArray(strings.raw)
  );
};

export const sql = DATABASE_PREFERENCE === 'supabase'
  ? sqlSupabase
  : sqlVercel;

export const directQuery = DATABASE_PREFERENCE === 'supabase'
  ? querySupabaseConnectionPool<any>
  : db.query;
