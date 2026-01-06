// Tests for PathwayRepository
// Tests both native (SQL) and web (AsyncStorage) code paths

import { PathwayRepository } from '@/lib/repositories/PathwayRepository';
import { Collections, StorageAdapter } from '@/lib/storage';
import { createMockStorageAdapter, seedMockAdapter } from '../../mocks/storageAdapter.mock';

describe('PathwayRepository', () => {
  let mockAdapter: ReturnType<typeof createMockStorageAdapter>;
  let repo: PathwayRepository;

  const mockProgress = {
    pathway_id: 'test-pathway',
    started_at: '2024-01-01T00:00:00Z',
    completed_at: null,
    concepts_completed: '[]',
  };

  beforeEach(() => {
    mockAdapter = createMockStorageAdapter();
    repo = new PathwayRepository(mockAdapter as unknown as StorageAdapter);
  });

  afterEach(() => {
    mockAdapter._reset();
  });

  describe('get', () => {
    it('should return null for non-existent pathway', async () => {
      const result = await repo.get('non-existent');
      expect(result).toBeNull();
    });

    it('should return validated pathway progress', async () => {
      seedMockAdapter(mockAdapter, Collections.PATHWAY_PROGRESS, [
        { id: 'test-pathway', record: mockProgress },
      ]);

      const result = await repo.get('test-pathway');
      expect(result).not.toBeNull();
      expect(result?.pathway_id).toBe('test-pathway');
      expect(result?.started_at).toBe('2024-01-01T00:00:00Z');
    });

    it('should return null for invalid data', async () => {
      seedMockAdapter(mockAdapter, Collections.PATHWAY_PROGRESS, [
        { id: 'invalid', record: { pathway_id: '' } }, // Invalid: empty pathway_id
      ]);

      const result = await repo.get('invalid');
      expect(result).toBeNull();
    });

    it('should handle adapter errors gracefully', async () => {
      mockAdapter.getOne.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await repo.get('test');
      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return empty array when no pathways', async () => {
      const result = await repo.getAll();
      expect(result).toEqual([]);
    });

    it('should return all valid pathway progress records', async () => {
      seedMockAdapter(mockAdapter, Collections.PATHWAY_PROGRESS, [
        { id: 'pathway-1', record: { ...mockProgress, pathway_id: 'pathway-1' } },
        { id: 'pathway-2', record: { ...mockProgress, pathway_id: 'pathway-2' } },
      ]);

      const result = await repo.getAll();
      expect(result).toHaveLength(2);
    });

    it('should filter out invalid records', async () => {
      seedMockAdapter(mockAdapter, Collections.PATHWAY_PROGRESS, [
        { id: 'valid', record: { ...mockProgress, pathway_id: 'valid' } },
        { id: 'invalid', record: { pathway_id: '' } }, // Invalid
      ]);

      const result = await repo.getAll();
      expect(result).toHaveLength(1);
      expect(result[0].pathway_id).toBe('valid');
    });

    it('should handle adapter errors gracefully', async () => {
      mockAdapter.getAll.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await repo.getAll();
      expect(result).toEqual([]);
    });
  });

  describe('start', () => {
    it('should create new pathway progress', async () => {
      await repo.start('new-pathway');

      expect(mockAdapter.upsert).toHaveBeenCalledWith(
        Collections.PATHWAY_PROGRESS,
        'new-pathway',
        expect.objectContaining({
          pathway_id: 'new-pathway',
          completed_at: null,
        })
      );
    });

    it('should not overwrite existing pathway', async () => {
      seedMockAdapter(mockAdapter, Collections.PATHWAY_PROGRESS, [
        { id: 'existing', record: mockProgress },
      ]);

      await repo.start('existing');

      // Should not call upsert because pathway already exists
      expect(mockAdapter.upsert).not.toHaveBeenCalled();
    });

    it('should throw on adapter error', async () => {
      mockAdapter.upsert.mockRejectedValueOnce(new Error('Write failed'));

      await expect(repo.start('new-pathway')).rejects.toThrow('Write failed');
    });
  });

  describe('isCompleted', () => {
    it('should return true for completed pathway', async () => {
      seedMockAdapter(mockAdapter, Collections.PATHWAY_PROGRESS, [
        { id: 'completed', record: { ...mockProgress, pathway_id: 'completed', completed_at: '2024-01-15T00:00:00Z' } },
      ]);

      const result = await repo.isCompleted('completed');
      expect(result).toBe(true);
    });

    it('should return false for incomplete pathway', async () => {
      seedMockAdapter(mockAdapter, Collections.PATHWAY_PROGRESS, [
        { id: 'incomplete', record: { ...mockProgress, pathway_id: 'incomplete', completed_at: null } },
      ]);

      const result = await repo.isCompleted('incomplete');
      expect(result).toBe(false);
    });

    it('should return false for non-existent pathway', async () => {
      const result = await repo.isCompleted('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete pathway from main table', async () => {
      await repo.delete('pathway-to-delete');

      expect(mockAdapter.delete).toHaveBeenCalledWith(
        Collections.PATHWAY_PROGRESS,
        'pathway-to-delete'
      );
    });

    it('should throw on adapter error', async () => {
      mockAdapter.delete.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(repo.delete('pathway')).rejects.toThrow('Delete failed');
    });
  });

  describe('deleteAll', () => {
    it('should clear all pathway progress', async () => {
      await repo.deleteAll();

      expect(mockAdapter.deleteAll).toHaveBeenCalledWith(Collections.PATHWAY_PROGRESS);
    });

    it('should throw on adapter error', async () => {
      mockAdapter.deleteAll.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(repo.deleteAll()).rejects.toThrow('Delete failed');
    });
  });

  describe('toDomain', () => {
    it('should convert row to domain object (deprecated - returns empty conceptsCompleted)', () => {
      const row = {
        pathway_id: 'pathway-123',
        started_at: '2024-01-01T00:00:00Z',
        completed_at: '2024-01-15T00:00:00Z',
      };

      const result = repo.toDomain(row);

      // toDomain is deprecated - it always returns empty conceptsCompleted
      // Use getDomain() instead for live completion data
      expect(result).toEqual({
        pathwayId: 'pathway-123',
        startedAt: '2024-01-01T00:00:00Z',
        completedAt: '2024-01-15T00:00:00Z',
        conceptsCompleted: [],
      });
    });

    it('should return empty conceptsCompleted for any row', () => {
      const row = {
        pathway_id: 'pathway-123',
        started_at: '2024-01-01T00:00:00Z',
        completed_at: null,
      };

      const result = repo.toDomain(row);
      // Legacy column removed - toDomain always returns empty array
      expect(result.conceptsCompleted).toEqual([]);
    });
  });

  // ============ Web-specific tests ============
  // Note: The mock adapter simulates web mode (no rawQuery/rawExecute)

  describe('web mode - getCompletedConcepts', () => {
    it('should return empty array when no completions', async () => {
      const result = await repo.getCompletedConcepts('pathway-1');
      expect(result).toEqual([]);
    });

    it('should return completed concepts from web storage', async () => {
      // Seed web completions via setValue
      const completions = {
        'pathway-1': [
          { pathway_id: 'pathway-1', concept_id: 'concept-1', completed_at: '2024-01-01T00:00:00Z' },
          { pathway_id: 'pathway-1', concept_id: 'concept-2', completed_at: '2024-01-02T00:00:00Z' },
        ],
      };
      mockAdapter._kvStore.set('@vocab:pathway_completions', JSON.stringify(completions));

      const result = await repo.getCompletedConcepts('pathway-1');
      expect(result).toContain('concept-1');
      expect(result).toContain('concept-2');
    });
  });

  describe('web mode - getCompletionCount', () => {
    it('should return 0 when no completions', async () => {
      const result = await repo.getCompletionCount('pathway-1');
      expect(result).toBe(0);
    });

    it('should return correct count from web storage', async () => {
      const completions = {
        'pathway-1': [
          { pathway_id: 'pathway-1', concept_id: 'concept-1', completed_at: '2024-01-01T00:00:00Z' },
          { pathway_id: 'pathway-1', concept_id: 'concept-2', completed_at: '2024-01-02T00:00:00Z' },
          { pathway_id: 'pathway-1', concept_id: 'concept-3', completed_at: '2024-01-03T00:00:00Z' },
        ],
      };
      mockAdapter._kvStore.set('@vocab:pathway_completions', JSON.stringify(completions));

      const result = await repo.getCompletionCount('pathway-1');
      expect(result).toBe(3);
    });
  });

  describe('web mode - isConceptCompleted', () => {
    it('should return false when concept not completed', async () => {
      const result = await repo.isConceptCompleted('pathway-1', 'concept-1');
      expect(result).toBe(false);
    });

    it('should return true when concept is completed', async () => {
      const completions = {
        'pathway-1': [
          { pathway_id: 'pathway-1', concept_id: 'concept-1', completed_at: '2024-01-01T00:00:00Z' },
        ],
      };
      mockAdapter._kvStore.set('@vocab:pathway_completions', JSON.stringify(completions));

      const result = await repo.isConceptCompleted('pathway-1', 'concept-1');
      expect(result).toBe(true);
    });

    it('should return false for different pathway', async () => {
      const completions = {
        'pathway-1': [
          { pathway_id: 'pathway-1', concept_id: 'concept-1', completed_at: '2024-01-01T00:00:00Z' },
        ],
      };
      mockAdapter._kvStore.set('@vocab:pathway_completions', JSON.stringify(completions));

      const result = await repo.isConceptCompleted('pathway-2', 'concept-1');
      expect(result).toBe(false);
    });
  });

  describe('web mode - updateProgress', () => {
    it('should add concept to web completions', async () => {
      // Start the pathway first
      seedMockAdapter(mockAdapter, Collections.PATHWAY_PROGRESS, [
        { id: 'pathway-1', record: mockProgress },
      ]);
      mockAdapter._kvStore.set('@vocab:pathway_completions', JSON.stringify({}));

      await repo.updateProgress('pathway-1', 'concept-1', 5);

      const storedCompletions = JSON.parse(
        mockAdapter._kvStore.get('@vocab:pathway_completions') || '{}'
      );
      expect(storedCompletions['pathway-1']).toBeDefined();
      expect(storedCompletions['pathway-1'].some((c: { concept_id: string }) => c.concept_id === 'concept-1')).toBe(true);
    });

    it('should mark pathway as completed when all concepts done', async () => {
      seedMockAdapter(mockAdapter, Collections.PATHWAY_PROGRESS, [
        { id: 'pathway-1', record: { ...mockProgress, pathway_id: 'pathway-1' } },
      ]);

      // Pre-populate with 4 completed concepts
      const completions = {
        'pathway-1': [
          { pathway_id: 'pathway-1', concept_id: 'c1', completed_at: '2024-01-01T00:00:00Z' },
          { pathway_id: 'pathway-1', concept_id: 'c2', completed_at: '2024-01-02T00:00:00Z' },
          { pathway_id: 'pathway-1', concept_id: 'c3', completed_at: '2024-01-03T00:00:00Z' },
          { pathway_id: 'pathway-1', concept_id: 'c4', completed_at: '2024-01-04T00:00:00Z' },
        ],
      };
      mockAdapter._kvStore.set('@vocab:pathway_completions', JSON.stringify(completions));

      // Add the 5th and final concept
      await repo.updateProgress('pathway-1', 'c5', 5);

      // Should have called update with completed_at set
      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.PATHWAY_PROGRESS,
        'pathway-1',
        expect.objectContaining({ completed_at: expect.any(String) })
      );
    });

    it('should not duplicate already completed concepts', async () => {
      seedMockAdapter(mockAdapter, Collections.PATHWAY_PROGRESS, [
        { id: 'pathway-1', record: { ...mockProgress, pathway_id: 'pathway-1' } },
      ]);

      const completions = {
        'pathway-1': [
          { pathway_id: 'pathway-1', concept_id: 'concept-1', completed_at: '2024-01-01T00:00:00Z' },
        ],
      };
      mockAdapter._kvStore.set('@vocab:pathway_completions', JSON.stringify(completions));

      // Try to add the same concept again
      await repo.updateProgress('pathway-1', 'concept-1', 5);

      // Should not have added a duplicate
      const storedCompletions = JSON.parse(
        mockAdapter._kvStore.get('@vocab:pathway_completions') || '{}'
      );
      expect(storedCompletions['pathway-1'].length).toBe(1);
    });

    it('should start pathway if not exists', async () => {
      mockAdapter._kvStore.set('@vocab:pathway_completions', JSON.stringify({}));

      await repo.updateProgress('new-pathway', 'concept-1', 5);

      // Should have called upsert to create the pathway
      expect(mockAdapter.upsert).toHaveBeenCalledWith(
        Collections.PATHWAY_PROGRESS,
        'new-pathway',
        expect.objectContaining({
          pathway_id: 'new-pathway',
        })
      );
    });
  });

  describe('web mode - getDomain', () => {
    it('should return null for non-existent pathway', async () => {
      const result = await repo.getDomain('non-existent');
      expect(result).toBeNull();
    });

    it('should return domain object with completions from junction', async () => {
      seedMockAdapter(mockAdapter, Collections.PATHWAY_PROGRESS, [
        { id: 'pathway-1', record: { ...mockProgress, pathway_id: 'pathway-1' } },
      ]);

      const completions = {
        'pathway-1': [
          { pathway_id: 'pathway-1', concept_id: 'concept-1', completed_at: '2024-01-01T00:00:00Z' },
          { pathway_id: 'pathway-1', concept_id: 'concept-2', completed_at: '2024-01-02T00:00:00Z' },
        ],
      };
      mockAdapter._kvStore.set('@vocab:pathway_completions', JSON.stringify(completions));

      const result = await repo.getDomain('pathway-1');

      expect(result).not.toBeNull();
      expect(result?.pathwayId).toBe('pathway-1');
      expect(result?.conceptsCompleted).toContain('concept-1');
      expect(result?.conceptsCompleted).toContain('concept-2');
    });
  });

  describe('web mode - delete cleans up completions', () => {
    it('should remove completions when deleting pathway', async () => {
      const completions = {
        'pathway-1': [
          { pathway_id: 'pathway-1', concept_id: 'concept-1', completed_at: '2024-01-01T00:00:00Z' },
        ],
        'pathway-2': [
          { pathway_id: 'pathway-2', concept_id: 'concept-1', completed_at: '2024-01-01T00:00:00Z' },
        ],
      };
      mockAdapter._kvStore.set('@vocab:pathway_completions', JSON.stringify(completions));

      await repo.delete('pathway-1');

      const storedCompletions = JSON.parse(
        mockAdapter._kvStore.get('@vocab:pathway_completions') || '{}'
      );
      expect(storedCompletions['pathway-1']).toBeUndefined();
      expect(storedCompletions['pathway-2']).toBeDefined();
    });
  });

  describe('web mode - deleteAll cleans up completions', () => {
    it('should remove all completions when deleting all', async () => {
      const completions = {
        'pathway-1': [
          { pathway_id: 'pathway-1', concept_id: 'concept-1', completed_at: '2024-01-01T00:00:00Z' },
        ],
        'pathway-2': [
          { pathway_id: 'pathway-2', concept_id: 'concept-1', completed_at: '2024-01-01T00:00:00Z' },
        ],
      };
      mockAdapter._kvStore.set('@vocab:pathway_completions', JSON.stringify(completions));

      await repo.deleteAll();

      const storedCompletions = JSON.parse(
        mockAdapter._kvStore.get('@vocab:pathway_completions') || '{}'
      );
      expect(Object.keys(storedCompletions)).toHaveLength(0);
    });
  });
});

// ============ Native mode tests ============
// These test SQL-specific behavior with rawQuery/rawExecute

describe('PathwayRepository (native mode)', () => {
  let mockAdapter: ReturnType<typeof createMockStorageAdapter> & {
    rawQuery: jest.Mock;
    rawExecute: jest.Mock;
  };
  let repo: PathwayRepository;

  const mockProgress = {
    pathway_id: 'test-pathway',
    started_at: '2024-01-01T00:00:00Z',
    completed_at: null,
    concepts_completed: '[]',
  };

  beforeEach(() => {
    const baseAdapter = createMockStorageAdapter();
    // Enable native mode by adding rawQuery/rawExecute
    mockAdapter = {
      ...baseAdapter,
      rawQuery: jest.fn().mockResolvedValue([]),
      rawExecute: jest.fn().mockResolvedValue(undefined),
    };
    repo = new PathwayRepository(mockAdapter as unknown as StorageAdapter);
  });

  afterEach(() => {
    mockAdapter._reset();
  });

  describe('getCompletedConcepts', () => {
    it('should query junction table', async () => {
      mockAdapter.rawQuery!.mockResolvedValue([
        { concept_id: 'concept-1' },
        { concept_id: 'concept-2' },
      ]);

      const result = await repo.getCompletedConcepts('pathway-1');

      expect(mockAdapter.rawQuery).toHaveBeenCalledWith(
        expect.stringContaining('pathway_concept_completions'),
        ['pathway-1']
      );
      expect(result).toContain('concept-1');
      expect(result).toContain('concept-2');
    });

    it('should return empty array on error', async () => {
      mockAdapter.rawQuery!.mockRejectedValueOnce(new Error('SQL error'));

      const result = await repo.getCompletedConcepts('pathway-1');

      // No longer falls back to legacy column - just returns empty array
      expect(result).toEqual([]);
    });
  });

  describe('getCompletionCount', () => {
    it('should query junction table for count', async () => {
      mockAdapter.rawQuery!.mockResolvedValue([{ count: 5 }]);

      const result = await repo.getCompletionCount('pathway-1');

      expect(mockAdapter.rawQuery).toHaveBeenCalledWith(
        expect.stringContaining('COUNT'),
        ['pathway-1']
      );
      expect(result).toBe(5);
    });

    it('should return 0 on error', async () => {
      mockAdapter.rawQuery!.mockRejectedValueOnce(new Error('SQL error'));

      const result = await repo.getCompletionCount('pathway-1');

      expect(result).toBe(0);
    });
  });

  describe('isConceptCompleted', () => {
    it('should query junction table for specific concept', async () => {
      mockAdapter.rawQuery!.mockResolvedValue([{ count: 1 }]);

      const result = await repo.isConceptCompleted('pathway-1', 'concept-1');

      expect(mockAdapter.rawQuery).toHaveBeenCalledWith(
        expect.stringContaining('pathway_concept_completions'),
        ['pathway-1', 'concept-1']
      );
      expect(result).toBe(true);
    });

    it('should return false when count is 0', async () => {
      mockAdapter.rawQuery!.mockResolvedValue([{ count: 0 }]);

      const result = await repo.isConceptCompleted('pathway-1', 'concept-1');

      expect(result).toBe(false);
    });
  });

  describe('updateProgress', () => {
    it('should insert into junction table', async () => {
      seedMockAdapter(mockAdapter, Collections.PATHWAY_PROGRESS, [
        { id: 'pathway-1', record: mockProgress },
      ]);
      mockAdapter.rawQuery!.mockResolvedValue([]); // No existing completions

      await repo.updateProgress('pathway-1', 'concept-1', 5);

      expect(mockAdapter.rawExecute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR IGNORE'),
        expect.arrayContaining(['pathway-1', 'concept-1'])
      );
    });
  });

  describe('delete', () => {
    it('should delete from junction table', async () => {
      await repo.delete('pathway-1');

      expect(mockAdapter.rawExecute).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM pathway_concept_completions'),
        ['pathway-1']
      );
      expect(mockAdapter.delete).toHaveBeenCalledWith(
        Collections.PATHWAY_PROGRESS,
        'pathway-1'
      );
    });
  });

  describe('deleteAll', () => {
    it('should clear junction table', async () => {
      await repo.deleteAll();

      expect(mockAdapter.rawExecute).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM pathway_concept_completions')
      );
      expect(mockAdapter.deleteAll).toHaveBeenCalledWith(Collections.PATHWAY_PROGRESS);
    });
  });
});
