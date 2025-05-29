import { sql } from '@/platforms/postgres';

export interface Migration {
  label: string;
  errorPhraseMatch?: RegExp;
  run: () => Promise<void>;
}

// Performance-focused indexes for common query patterns
export const addPerformanceIndexes: Migration = {
  label: 'Add performance indexes',
  run: async () => {
    console.log('Creating performance indexes...');
    
    // Index for sorting by taken_at (most common sort)
    await sql`
      CREATE INDEX IF NOT EXISTS idx_photos_taken_at 
      ON photos(taken_at DESC)
    `;
    
    // Index for filtering by hidden status
    await sql`
      CREATE INDEX IF NOT EXISTS idx_photos_hidden 
      ON photos(hidden)
      WHERE hidden IS NOT NULL
    `;
    
    // Composite index for camera queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_photos_make_model 
      ON photos(make, model)
      WHERE make IS NOT NULL AND model IS NOT NULL
    `;
    
    // Index for film queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_photos_film 
      ON photos(film)
      WHERE film IS NOT NULL
    `;
    
    // Index for focal length queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_photos_focal_length 
      ON photos(focal_length)
      WHERE focal_length IS NOT NULL
    `;
    
    // Composite index for lens queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_photos_lens 
      ON photos(lens_make, lens_model)
      WHERE lens_model IS NOT NULL
    `;
    
    // Index for recipe queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_photos_recipe_title 
      ON photos(recipe_title)
      WHERE recipe_title IS NOT NULL
    `;
    
    // Index for updated_at (used in sync and recent updates)
    await sql`
      CREATE INDEX IF NOT EXISTS idx_photos_updated_at 
      ON photos(updated_at DESC)
    `;
    
    // Index for created_at (used in admin sorting)
    await sql`
      CREATE INDEX IF NOT EXISTS idx_photos_created_at 
      ON photos(created_at DESC)
    `;
    
    // GIN index for tags array searches
    await sql`
      CREATE INDEX IF NOT EXISTS idx_photos_tags 
      ON photos USING GIN(tags)
      WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
    `;
    
    // Composite index for date range queries with hidden filter
    await sql`
      CREATE INDEX IF NOT EXISTS idx_photos_taken_at_hidden 
      ON photos(taken_at DESC, hidden)
      WHERE hidden IS NOT TRUE
    `;
    
    // Index for priority order (used in sorting)
    await sql`
      CREATE INDEX IF NOT EXISTS idx_photos_priority_order 
      ON photos(priority_order)
      WHERE priority_order IS NOT NULL
    `;
    
    console.log('Performance indexes created successfully');
  },
};

// Function to run all performance indexes
export const createPerformanceIndexes = async () => {
  try {
    await addPerformanceIndexes.run();
    
    // Analyze tables to update statistics after index creation
    await sql`ANALYZE photos`;
    
    console.log('Database optimization complete');
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  }
};