import { query, sql } from '@/platforms/postgres';

interface Migration {
  label: string
  table?: 'photos' | 'albums'
  fields: string[]
  run: () => ReturnType<typeof sql>
}

export const MIGRATIONS: Migration[] = [{
  label: '01: AI Text Generation',
  fields: ['caption', 'semantic_description'],
  run: () => sql`
    ALTER TABLE photos
    ADD COLUMN IF NOT EXISTS caption TEXT,
    ADD COLUMN IF NOT EXISTS semantic_description TEXT
  `,
}, {
  label: '02: Lens Metadata',
  fields: ['lens_make', 'lens_model'],
  run: () => sql`
    ALTER TABLE photos
    ADD COLUMN IF NOT EXISTS lens_make VARCHAR(255),
    ADD COLUMN IF NOT EXISTS lens_model VARCHAR(255)
  `,
}, {
  label: '03: Fujifilm Recipe: Data',
  fields: ['recipe_data'],
  run: () => sql`
    DO $$
    BEGIN
      IF EXISTS(
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='photos'
        AND column_name='fujifilm_recipe'
      )
      THEN
        ALTER TABLE photos
        RENAME COLUMN fujifilm_recipe TO recipe_data;
      ELSE
        ALTER TABLE photos
        ADD COLUMN IF NOT EXISTS recipe_data JSONB;
      END IF;
    END $$;
  `,
}, {
  label: '04: Fujifilm Recipe: Title',
  fields: ['recipe_title'],
  run: () => sql`
    ALTER TABLE photos
    ADD COLUMN IF NOT EXISTS recipe_title VARCHAR(255)
  `,
}, {
  label: '05: Universal Film',
  fields: ['film'],
  run: () => sql`
    DO $$
    BEGIN
      IF EXISTS(
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='photos'
        AND column_name='film_simulation'
      )
      THEN
        ALTER TABLE photos
        RENAME COLUMN film_simulation TO film;
      ELSE
        ALTER TABLE photos
        ADD COLUMN IF NOT EXISTS film VARCHAR(255);
      END IF;
    END $$;
  `,
}, {
  label: '06: Exclude from feeds',
  fields: ['exclude_from_feeds'],
  run: () => sql`
    ALTER TABLE photos
    ADD COLUMN IF NOT EXISTS exclude_from_feeds BOOLEAN DEFAULT FALSE
  `,
}, {
  label: '07: Color Data',
  fields: ['color_data', 'color_sort'],
  run: () => sql`
    ALTER TABLE photos
    ADD COLUMN IF NOT EXISTS color_data JSONB,
    ADD COLUMN IF NOT EXISTS color_sort SMALLINT
  `,
}, {
  label: '08: Location',
  table: 'albums',
  fields: ['location'],
  // `query()` seemingly required to execute
  // ADD and DROP column alteration in same migration
  run: () => query(`
    ALTER TABLE albums
    ADD COLUMN IF NOT EXISTS location JSONB;
    ALTER TABLE albums
    DROP COLUMN IF EXISTS location_name,
    DROP COLUMN IF EXISTS latitude,
    DROP COLUMN IF EXISTS longitude;
  `),
}];

export const migrationForError = (e: any) =>
  MIGRATIONS.find(({ fields, table = 'photos' }) =>
    fields.some(field =>(
      // eslint-disable-next-line max-len
      new RegExp(`column "${field}" of relation "${table}" does not exist`, 'i').test(e.message) ||
      new RegExp(`column "${field}" does not exist`, 'i').test(e.message)
    )),
  );
