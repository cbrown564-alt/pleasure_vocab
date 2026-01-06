// Tests for ConceptRepository

import { ConceptRepository } from '@/lib/repositories/ConceptRepository';
import { Collections, StorageAdapter } from '@/lib/storage';
import { createMockStorageAdapter, seedMockAdapter } from '../../mocks/storageAdapter.mock';

describe('ConceptRepository', () => {
  let mockAdapter: ReturnType<typeof createMockStorageAdapter>;
  let repo: ConceptRepository;

  const mockConcept = {
    concept_id: 'test-concept',
    status: 'explored',
    is_unlocked: 1,
    is_mastered: 0,
    explored_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    mockAdapter = createMockStorageAdapter();
    repo = new ConceptRepository(mockAdapter as unknown as StorageAdapter);
  });

  afterEach(() => {
    mockAdapter._reset();
  });

  describe('get', () => {
    it('should return null for non-existent concept', async () => {
      const result = await repo.get('non-existent');
      expect(result).toBeNull();
    });

    it('should return validated concept', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'test-concept', record: mockConcept },
      ]);

      const result = await repo.get('test-concept');
      expect(result).not.toBeNull();
      expect(result?.concept_id).toBe('test-concept');
      expect(result?.status).toBe('explored');
    });

    it('should return null for invalid data', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'invalid', record: { concept_id: 'invalid', status: 'bad_status' } },
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
    it('should return empty array when no concepts', async () => {
      const result = await repo.getAll();
      expect(result).toEqual([]);
    });

    it('should return all valid concepts', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'concept-1', record: { ...mockConcept, concept_id: 'concept-1' } },
        { id: 'concept-2', record: { ...mockConcept, concept_id: 'concept-2' } },
      ]);

      const result = await repo.getAll();
      expect(result).toHaveLength(2);
    });

    it('should filter out invalid concepts', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'valid', record: { ...mockConcept, concept_id: 'valid' } },
        { id: 'invalid', record: { concept_id: 'invalid', status: 'bad_status' } },
      ]);

      const result = await repo.getAll();
      expect(result).toHaveLength(1);
      expect(result[0].concept_id).toBe('valid');
    });

    it('should handle adapter errors gracefully', async () => {
      mockAdapter.getAll.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await repo.getAll();
      expect(result).toEqual([]);
    });
  });

  describe('getByStatus', () => {
    it('should filter concepts by status', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'explored', record: { ...mockConcept, concept_id: 'explored', status: 'explored' } },
        { id: 'resonates', record: { ...mockConcept, concept_id: 'resonates', status: 'resonates' } },
      ]);

      const result = await repo.getByStatus('explored');
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('explored');
    });
  });

  describe('updateStatus', () => {
    it('should update existing concept status', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'test', record: mockConcept },
      ]);

      await repo.updateStatus('test', 'resonates');

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.USER_CONCEPTS,
        'test',
        expect.objectContaining({ status: 'resonates' })
      );
    });

    it('should create new concept if not exists', async () => {
      await repo.updateStatus('new-concept', 'curious');

      expect(mockAdapter.upsert).toHaveBeenCalledWith(
        Collections.USER_CONCEPTS,
        'new-concept',
        expect.objectContaining({
          concept_id: 'new-concept',
          status: 'curious',
          is_unlocked: 0,
          is_mastered: 0,
        })
      );
    });

    it('should preserve existing explored_at', async () => {
      const existingDate = '2024-01-01T00:00:00Z';
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'test', record: { ...mockConcept, explored_at: existingDate } },
      ]);

      await repo.updateStatus('test', 'resonates');

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.USER_CONCEPTS,
        'test',
        expect.objectContaining({ explored_at: existingDate })
      );
    });

    it('should throw on adapter error', async () => {
      mockAdapter.update.mockRejectedValueOnce(new Error('Update failed'));
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'test', record: mockConcept },
      ]);

      await expect(repo.updateStatus('test', 'resonates')).rejects.toThrow('Update failed');
    });
  });

  describe('markExplored', () => {
    it('should mark unexplored concept as explored', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'test', record: { ...mockConcept, status: 'unexplored' } },
      ]);

      await repo.markExplored('test');

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.USER_CONCEPTS,
        'test',
        expect.objectContaining({ status: 'explored' })
      );
    });

    it('should not change status if already explored', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'test', record: { ...mockConcept, status: 'resonates' } },
      ]);

      await repo.markExplored('test');

      // Should not update because status is not 'unexplored'
      expect(mockAdapter.update).not.toHaveBeenCalled();
    });

    it('should create new concept with explored status', async () => {
      await repo.markExplored('new-concept');

      expect(mockAdapter.upsert).toHaveBeenCalledWith(
        Collections.USER_CONCEPTS,
        'new-concept',
        expect.objectContaining({
          concept_id: 'new-concept',
          status: 'explored',
        })
      );
    });
  });

  describe('unlock', () => {
    it('should unlock existing concept', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'test', record: { ...mockConcept, is_unlocked: 0 } },
      ]);

      await repo.unlock('test');

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.USER_CONCEPTS,
        'test',
        expect.objectContaining({ is_unlocked: 1 })
      );
    });

    it('should create unlocked concept if not exists', async () => {
      await repo.unlock('new-concept');

      expect(mockAdapter.upsert).toHaveBeenCalledWith(
        Collections.USER_CONCEPTS,
        'new-concept',
        expect.objectContaining({
          concept_id: 'new-concept',
          is_unlocked: 1,
          is_mastered: 0,
          status: 'unexplored',
        })
      );
    });
  });

  describe('master', () => {
    it('should master existing concept (also unlocks)', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'test', record: { ...mockConcept, is_unlocked: 0, is_mastered: 0 } },
      ]);

      await repo.master('test');

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.USER_CONCEPTS,
        'test',
        expect.objectContaining({ is_unlocked: 1, is_mastered: 1 })
      );
    });

    it('should create mastered concept if not exists', async () => {
      await repo.master('new-concept');

      expect(mockAdapter.upsert).toHaveBeenCalledWith(
        Collections.USER_CONCEPTS,
        'new-concept',
        expect.objectContaining({
          is_unlocked: 1,
          is_mastered: 1,
        })
      );
    });
  });

  describe('isUnlocked', () => {
    it('should return true for unlocked concept', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'test', record: { ...mockConcept, is_unlocked: 1 } },
      ]);

      const result = await repo.isUnlocked('test');
      expect(result).toBe(true);
    });

    it('should return false for locked concept', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'test', record: { ...mockConcept, is_unlocked: 0 } },
      ]);

      const result = await repo.isUnlocked('test');
      expect(result).toBe(false);
    });

    it('should return false for non-existent concept', async () => {
      const result = await repo.isUnlocked('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('isMastered', () => {
    it('should return true for mastered concept', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'test', record: { ...mockConcept, is_mastered: 1 } },
      ]);

      const result = await repo.isMastered('test');
      expect(result).toBe(true);
    });

    it('should return false for non-mastered concept', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'test', record: { ...mockConcept, is_mastered: 0 } },
      ]);

      const result = await repo.isMastered('test');
      expect(result).toBe(false);
    });
  });

  describe('getUnlockedIds', () => {
    it('should return IDs of unlocked concepts', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'unlocked-1', record: { ...mockConcept, concept_id: 'unlocked-1', is_unlocked: 1 } },
        { id: 'locked', record: { ...mockConcept, concept_id: 'locked', is_unlocked: 0 } },
        { id: 'unlocked-2', record: { ...mockConcept, concept_id: 'unlocked-2', is_unlocked: 1 } },
      ]);

      const result = await repo.getUnlockedIds();
      expect(result).toContain('unlocked-1');
      expect(result).toContain('unlocked-2');
      expect(result).not.toContain('locked');
    });
  });

  describe('getMasteredIds', () => {
    it('should return IDs of mastered concepts', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'mastered', record: { ...mockConcept, concept_id: 'mastered', is_mastered: 1 } },
        { id: 'not-mastered', record: { ...mockConcept, concept_id: 'not-mastered', is_mastered: 0 } },
      ]);

      const result = await repo.getMasteredIds();
      expect(result).toContain('mastered');
      expect(result).not.toContain('not-mastered');
    });
  });

  describe('getExploredCount', () => {
    it('should count non-unexplored concepts', async () => {
      seedMockAdapter(mockAdapter, Collections.USER_CONCEPTS, [
        { id: 'explored', record: { ...mockConcept, concept_id: 'explored', status: 'explored' } },
        { id: 'resonates', record: { ...mockConcept, concept_id: 'resonates', status: 'resonates' } },
        { id: 'unexplored', record: { ...mockConcept, concept_id: 'unexplored', status: 'unexplored' } },
      ]);

      const result = await repo.getExploredCount();
      expect(result).toBe(2);
    });

    it('should return 0 when no concepts', async () => {
      const result = await repo.getExploredCount();
      expect(result).toBe(0);
    });
  });

  describe('getResonatesCount', () => {
    it('should count resonates concepts', async () => {
      // This uses adapter.count which we need to mock the return for
      mockAdapter.count.mockResolvedValue(3);

      const result = await repo.getResonatesCount();
      expect(result).toBe(3);
      expect(mockAdapter.count).toHaveBeenCalledWith(
        Collections.USER_CONCEPTS,
        { status: 'resonates' }
      );
    });
  });

  describe('deleteAll', () => {
    it('should call adapter.deleteAll', async () => {
      await repo.deleteAll();
      expect(mockAdapter.deleteAll).toHaveBeenCalledWith(Collections.USER_CONCEPTS);
    });

    it('should throw on adapter error', async () => {
      mockAdapter.deleteAll.mockRejectedValueOnce(new Error('Delete failed'));
      await expect(repo.deleteAll()).rejects.toThrow('Delete failed');
    });
  });
});
