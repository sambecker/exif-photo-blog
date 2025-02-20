import { sql } from '@/platforms/postgres';

interface Migration {
  label: string
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
  label: '03: Fujifilm Recipe',
  fields: ['fujifilm_recipe'],
  run: () => sql`
    ALTER TABLE photos
    ADD COLUMN IF NOT EXISTS fujifilm_recipe JSONB
  `,
}];

export const migrationForError = (e: any) =>
  MIGRATIONS.find(migration =>
    migration.fields.some(field =>
      new RegExp(`column "${field}" of relation "photos" does not exist`, 'i')
        .test(e.message),
    ),
  );