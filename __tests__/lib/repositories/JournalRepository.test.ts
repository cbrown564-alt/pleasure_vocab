// Tests for JournalRepository

import { JournalRepository } from '@/lib/repositories/JournalRepository';
import { Collections, StorageAdapter } from '@/lib/storage';
import { createMockStorageAdapter, seedMockAdapter } from '../../mocks/storageAdapter.mock';

// Mock generateId to return predictable values
jest.mock('@/lib/utils/id', () => ({
  generateId: jest.fn(() => 'generated-id-123'),
}));

describe('JournalRepository', () => {
  let mockAdapter: ReturnType<typeof createMockStorageAdapter>;
  let repo: JournalRepository;

  const mockEntry = {
    id: 'entry-1',
    concept_id: 'concept-1',
    content: 'Test journal content',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    mockAdapter = createMockStorageAdapter();
    repo = new JournalRepository(mockAdapter as unknown as StorageAdapter);
  });

  afterEach(() => {
    mockAdapter._reset();
  });

  describe('get', () => {
    it('should return null for non-existent entry', async () => {
      const result = await repo.get('non-existent');
      expect(result).toBeNull();
    });

    it('should return validated journal entry', async () => {
      seedMockAdapter(mockAdapter, Collections.JOURNAL_ENTRIES, [
        { id: 'entry-1', record: mockEntry },
      ]);

      const result = await repo.get('entry-1');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('entry-1');
      expect(result?.content).toBe('Test journal content');
    });

    it('should return null for invalid data', async () => {
      seedMockAdapter(mockAdapter, Collections.JOURNAL_ENTRIES, [
        { id: 'invalid', record: { id: '' } }, // Invalid: empty id
      ]);

      const result = await repo.get('invalid');
      expect(result).toBeNull();
    });

    it('should handle adapter errors gracefully', async () => {
      mockAdapter.getOne.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await repo.get('entry-1');
      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return empty array when no entries', async () => {
      const result = await repo.getAll();
      expect(result).toEqual([]);
    });

    it('should return all valid journal entries', async () => {
      seedMockAdapter(mockAdapter, Collections.JOURNAL_ENTRIES, [
        { id: 'entry-1', record: mockEntry },
        { id: 'entry-2', record: { ...mockEntry, id: 'entry-2', content: 'Second entry' } },
      ]);

      const result = await repo.getAll();
      expect(result).toHaveLength(2);
    });

    it('should filter out invalid entries', async () => {
      seedMockAdapter(mockAdapter, Collections.JOURNAL_ENTRIES, [
        { id: 'valid', record: mockEntry },
        { id: 'invalid', record: { id: '' } }, // Invalid
      ]);

      const result = await repo.getAll();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('entry-1');
    });

    it('should handle adapter errors gracefully', async () => {
      mockAdapter.getAll.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await repo.getAll();
      expect(result).toEqual([]);
    });
  });

  describe('getForConcept', () => {
    it('should return entries for specific concept', async () => {
      seedMockAdapter(mockAdapter, Collections.JOURNAL_ENTRIES, [
        { id: 'entry-1', record: { ...mockEntry, concept_id: 'concept-1' } },
        { id: 'entry-2', record: { ...mockEntry, id: 'entry-2', concept_id: 'concept-2' } },
        { id: 'entry-3', record: { ...mockEntry, id: 'entry-3', concept_id: 'concept-1' } },
      ]);

      const result = await repo.getForConcept('concept-1');
      expect(result).toHaveLength(2);
      result.forEach(entry => {
        expect(entry.concept_id).toBe('concept-1');
      });
    });

    it('should return empty array when no entries for concept', async () => {
      seedMockAdapter(mockAdapter, Collections.JOURNAL_ENTRIES, [
        { id: 'entry-1', record: { ...mockEntry, concept_id: 'concept-1' } },
      ]);

      const result = await repo.getForConcept('concept-2');
      expect(result).toEqual([]);
    });

    it('should handle adapter errors gracefully', async () => {
      mockAdapter.getWhere.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await repo.getForConcept('concept-1');
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create new journal entry', async () => {
      const id = await repo.create('My journal content', 'concept-1');

      expect(id).toBe('generated-id-123');
      expect(mockAdapter.upsert).toHaveBeenCalledWith(
        Collections.JOURNAL_ENTRIES,
        'generated-id-123',
        expect.objectContaining({
          id: 'generated-id-123',
          concept_id: 'concept-1',
          content: 'My journal content',
        })
      );
    });

    it('should create entry without concept_id', async () => {
      const id = await repo.create('General reflection');

      expect(id).toBe('generated-id-123');
      expect(mockAdapter.upsert).toHaveBeenCalledWith(
        Collections.JOURNAL_ENTRIES,
        'generated-id-123',
        expect.objectContaining({
          concept_id: null,
          content: 'General reflection',
        })
      );
    });

    it('should throw on adapter error', async () => {
      mockAdapter.upsert.mockRejectedValueOnce(new Error('Write failed'));

      await expect(repo.create('Content')).rejects.toThrow('Write failed');
    });
  });

  describe('update', () => {
    it('should update journal entry content', async () => {
      await repo.update('entry-1', 'Updated content');

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.JOURNAL_ENTRIES,
        'entry-1',
        expect.objectContaining({
          content: 'Updated content',
          updated_at: expect.any(String),
        })
      );
    });

    it('should throw on adapter error', async () => {
      mockAdapter.update.mockRejectedValueOnce(new Error('Update failed'));

      await expect(repo.update('entry-1', 'Content')).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete journal entry', async () => {
      await repo.delete('entry-1');

      expect(mockAdapter.delete).toHaveBeenCalledWith(
        Collections.JOURNAL_ENTRIES,
        'entry-1'
      );
    });

    it('should throw on adapter error', async () => {
      mockAdapter.delete.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(repo.delete('entry-1')).rejects.toThrow('Delete failed');
    });
  });

  describe('deleteAll', () => {
    it('should delete all journal entries', async () => {
      await repo.deleteAll();

      expect(mockAdapter.deleteAll).toHaveBeenCalledWith(Collections.JOURNAL_ENTRIES);
    });

    it('should throw on adapter error', async () => {
      mockAdapter.deleteAll.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(repo.deleteAll()).rejects.toThrow('Delete failed');
    });
  });

  describe('toDomain', () => {
    it('should convert row to domain object', () => {
      const result = repo.toDomain(mockEntry);

      expect(result).toEqual({
        id: 'entry-1',
        conceptId: 'concept-1',
        content: 'Test journal content',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });
    });

    it('should handle null concept_id', () => {
      const entry = { ...mockEntry, concept_id: null };
      const result = repo.toDomain(entry);

      expect(result.conceptId).toBeNull();
    });
  });

  describe('getAllDomain', () => {
    it('should return all entries as domain objects', async () => {
      seedMockAdapter(mockAdapter, Collections.JOURNAL_ENTRIES, [
        { id: 'entry-1', record: mockEntry },
        { id: 'entry-2', record: { ...mockEntry, id: 'entry-2' } },
      ]);

      const result = await repo.getAllDomain();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('conceptId');
      expect(result[0]).toHaveProperty('createdAt');
    });
  });
});
