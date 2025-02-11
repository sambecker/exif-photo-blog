import { POSTGRES_SSL_ENABLED } from '@/site/config';
import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ...(POSTGRES_SSL_ENABLED && {
    ssl: {
      rejectUnauthorized: false,
      ca: `-----BEGIN CERTIFICATE-----
         MIIEQTCCAqmgAwIBAgIUT0hAMuVW052+CkDsf9VLQpRVmGMwDQYJKoZIhvcNAQEM
         BQAwOjE4MDYGA1UEAwwvNTIwMmExYmItMGNjMS00MGM3LWIwMGUtNmEyZjA1NjU2
         MWY5IFByb2plY3QgQ0EwHhcNMjQwNzI3MDUwOTI0WhcNMzQwNzI1MDUwOTI0WjA6
         MTgwNgYDVQQDDC81MjAyYTFiYi0wY2MxLTQwYzctYjAwZS02YTJmMDU2NTYxZjkg
         UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBALC8e9J1
         BKIfjVBqbWW2xT5u1p4/R3Dfnwh68fn8pKaH7iuYvkKYBRtKGIdOrndN1NUz0vQ5
         KCTMGut3SWMan5Y5AnNp/BKCnh7APbRtj6kYaeO+uvMKZ0OTRO7mDk5ma3XEFOJ8
         QbW5WRVIuHuWHDTuJSijI+9soRvDgmTEIywZECJeSm527KwUfUqCPm7WTmEWUki8
         xn7rbQCIi37ZieD0Ojc9f64nLDDm9GRhLG4aGIjecCYTcmG2VBMvtxT7NZQNs56j
         xrp7X8bBHJz/QelWK/w0Zg1NIdW7H2m2R9BPqkolkJqZXAbHt2pVGkojnPY7Oz6X
         y5VJhNgrJu5RwXsxxaODG/UqtYSga7y4c42ncOlzEaPhoJQ4/zoHBZu2g8/ShfxA
         dxJWOjj6LIsPOT75+zfb7CI34W4hrX//sKJXF8VwihroVNwCa620BFTyj6WLnqXG
         e7GAI5/rrI96OimdxB6YdecuNNfo6USlmDEw3ckJ93XEm866pIR/+CifMwIDAQAB
         oz8wPTAdBgNVHQ4EFgQUPpwrV3pToTJZeQcHLIR3bUJF85gwDwYDVR0TBAgwBgEB
         /wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBACsNdaAaLrZdIePY
         qsdvOzC7o+I4aQKZgCQL/u/2a6uMKKT5lTgsJZ7hDAm5G471pdShuv+gQaa9tTZf
         TW5xF5+KU8JAUmcL5eCvEkSF9fsyWN2cR0vvU/NOU7h6Lp+W/N03MCUwhqeE8xBs
         /HYM1nIX4aKItbtODfUF2ZcaJTD2WtXRsE93dXV6Sqidx+1R8fiIBvLrCneZxN4V
         ejjhW9Kk1L/7AswOez9sk/9DETKQ9ZQdVq/SZrDxOFPJMaAFN+Q0fpXNen3LO7b3
         rTdRCuPU36VNHJLBdChs5cOJ8N7nC2eZh8H+uv+0VnL65LH2zwFyhNp4tQCeZCIK
         EfEpGw91HExMwr+oVAXhMt9weGGrGn6U5v6VIJBcC2926lU2x4qrQs6ZiiyPU85/
         LCcUsffBeJNjfrYu7rrzsH1eyD7F3Yp0DDbLHODFKnLKwjyw6hcxFvsGf55vENNu
         mNEMbO7q+A/q5rjSp1jAH5LDrQGdHi1eZLXi/Z83xTmtgRp47g==
         -----END CERTIFICATE-----`,
    },
  }),
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

export const convertArrayToPostgresString = (
  array?: string[],
  type: 'braces' | 'brackets' | 'parentheses' = 'braces',
) =>
  array
    ? type === 'braces'
      ? `{${array.join(',')}}`
      : type === 'brackets'
        ? `[${array.map((i) => `'${i}'`).join(',')}]`
        : `(${array.map((i) => `'${i}'`).join(',')})`
    : null;

const isTemplateStringsArray = (
  strings: unknown,
): strings is TemplateStringsArray => {
  return (
    Array.isArray(strings) && 'raw' in strings && Array.isArray(strings.raw)
  );
};

export const testDatabaseConnection = async () =>
  query('SELECt COUNT(*) FROM pg_stat_user_tables');
