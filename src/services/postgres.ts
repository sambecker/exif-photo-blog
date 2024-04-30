import { Client, QueryResultRow } from 'pg';

export type Primitive = string | number | boolean | undefined | null;

export const directQuery = async <T extends QueryResultRow = any>(
  queryString: string,
  values: Primitive[],
) => {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: true,
  });
  await client.connect();
  const response = await client.query<T>(queryString, values);
  await client.end();
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

  return directQuery<T>(result, values);
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
