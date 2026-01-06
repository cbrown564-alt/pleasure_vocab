// Migration definitions
// Each migration has a version number, description, and up function.
// Migrations are run in order by version number.

import { Migration } from './types';

/**
 * All migrations for the app.
 * IMPORTANT: Never modify existing migrations after they've been released.
 * Always add new migrations with incrementing version numbers.
 */
export const migrations: Migration[] = [
  {
    version: 1,
    description: 'Add is_unlocked and is_mastered columns to user_concepts',
    up: async (ctx) => {
      if (ctx.platform === 'native' && ctx.executeSql) {
        // Check if columns already exist (migration might have run before versioning)
        // SQLite doesn't support IF NOT EXISTS for ALTER TABLE, so we handle this
        // in the runner by checking PRAGMA table_info
        ctx.log('Adding is_unlocked column to user_concepts');
        await ctx.executeSql(
          'ALTER TABLE user_concepts ADD COLUMN is_unlocked INTEGER DEFAULT 0'
        );
        ctx.log('Adding is_mastered column to user_concepts');
        await ctx.executeSql(
          'ALTER TABLE user_concepts ADD COLUMN is_mastered INTEGER DEFAULT 0'
        );
      } else if (ctx.platform === 'web' && ctx.getValue && ctx.setValue) {
        // Web: Update existing records to include new fields
        ctx.log('Updating user_concepts schema for web');
        const data = await ctx.getValue('@vocab:user_concepts');
        if (data) {
          const concepts = JSON.parse(data);
          for (const key of Object.keys(concepts)) {
            if (concepts[key].is_unlocked === undefined) {
              concepts[key].is_unlocked = 0;
            }
            if (concepts[key].is_mastered === undefined) {
              concepts[key].is_mastered = 0;
            }
          }
          await ctx.setValue('@vocab:user_concepts', JSON.stringify(concepts));
        }
      }
    },
  },
  {
    version: 2,
    description: 'Seed default unlocked concepts',
    up: async (ctx) => {
      const defaultUnlocked = ['angling', 'rocking', 'shallowing'];
      const now = new Date().toISOString();

      if (ctx.platform === 'native' && ctx.executeSql) {
        for (const conceptId of defaultUnlocked) {
          ctx.log(`Ensuring ${conceptId} is unlocked`);
          // Use INSERT OR IGNORE to avoid duplicates, then UPDATE to set unlocked
          await ctx.executeSql(
            `INSERT OR IGNORE INTO user_concepts (concept_id, status, is_unlocked, is_mastered, updated_at)
             VALUES (?, 'unexplored', 1, 0, ?)`,
            [conceptId, now]
          );
          await ctx.executeSql(
            `UPDATE user_concepts SET is_unlocked = 1 WHERE concept_id = ? AND is_unlocked = 0`,
            [conceptId]
          );
        }
      } else if (ctx.platform === 'web' && ctx.getValue && ctx.setValue) {
        ctx.log('Seeding default unlocked concepts for web');
        const data = await ctx.getValue('@vocab:user_concepts');
        const concepts = data ? JSON.parse(data) : {};

        for (const conceptId of defaultUnlocked) {
          if (!concepts[conceptId]) {
            concepts[conceptId] = {
              concept_id: conceptId,
              status: 'unexplored',
              is_unlocked: 1,
              is_mastered: 0,
              explored_at: null,
              updated_at: now,
            };
          } else if (concepts[conceptId].is_unlocked !== 1) {
            concepts[conceptId].is_unlocked = 1;
            concepts[conceptId].updated_at = now;
          }
        }

        await ctx.setValue('@vocab:user_concepts', JSON.stringify(concepts));
      }
    },
  },
  {
    version: 3,
    description: 'Normalize pathway progress with junction table',
    up: async (ctx) => {
      if (ctx.platform === 'native' && ctx.executeSql) {
        // Create junction table
        ctx.log('Creating pathway_concept_completions junction table');
        await ctx.executeSql(`
          CREATE TABLE IF NOT EXISTS pathway_concept_completions (
            pathway_id TEXT NOT NULL,
            concept_id TEXT NOT NULL,
            completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (pathway_id, concept_id)
          )
        `);

        // Create index for faster lookups
        ctx.log('Creating index on pathway_concept_completions');
        await ctx.executeSql(`
          CREATE INDEX IF NOT EXISTS idx_pathway_completions_pathway
          ON pathway_concept_completions(pathway_id)
        `);

        // Migrate existing data from JSON column
        ctx.log('Migrating existing pathway progress data');
        // Note: We can't easily query and iterate in a migration context,
        // so we'll handle this in the repository layer by checking both sources
        // during a transition period, then cleaning up the old column later.
      } else if (ctx.platform === 'web' && ctx.getValue && ctx.setValue) {
        // Web: Create new storage structure for junction data
        ctx.log('Creating pathway completions storage for web');
        const existingProgress = await ctx.getValue('@vocab:pathway_progress');

        if (existingProgress) {
          const progressMap = JSON.parse(existingProgress);
          const completions: Record<string, { pathway_id: string; concept_id: string; completed_at: string }[]> = {};

          // Migrate each pathway's concepts_completed to the new structure
          for (const [pathwayId, progress] of Object.entries(progressMap)) {
            const p = progress as { concepts_completed?: string };
            if (p.concepts_completed) {
              try {
                const conceptIds: string[] = JSON.parse(p.concepts_completed);
                completions[pathwayId] = conceptIds.map(conceptId => ({
                  pathway_id: pathwayId,
                  concept_id: conceptId,
                  completed_at: new Date().toISOString(),
                }));
              } catch {
                // Invalid JSON, skip
              }
            }
          }

          await ctx.setValue('@vocab:pathway_completions', JSON.stringify(completions));
        }
      }
    },
  },
];

/**
 * Get the latest migration version.
 */
export function getLatestVersion(): number {
  if (migrations.length === 0) return 0;
  return Math.max(...migrations.map(m => m.version));
}

/**
 * Get migrations that need to run given the current version.
 */
export function getPendingMigrations(currentVersion: number): Migration[] {
  return migrations
    .filter(m => m.version > currentVersion)
    .sort((a, b) => a.version - b.version);
}
