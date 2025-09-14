import { sql } from '@/platforms/postgres';

export const createAlbumsTable = () =>
  sql`
    CREATE TABLE IF NOT EXISTS albums (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255),
      slug VARCHAR(255),
      description TEXT,
      location_name VARCHAR(255),
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
