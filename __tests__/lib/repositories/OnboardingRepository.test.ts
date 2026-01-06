// Tests for OnboardingRepository

import { OnboardingRepository } from '@/lib/repositories/OnboardingRepository';
import { Collections, StorageAdapter } from '@/lib/storage';
import { DEFAULT_ONBOARDING } from '@/lib/validation';
import { createMockStorageAdapter, seedMockAdapter } from '../../mocks/storageAdapter.mock';

describe('OnboardingRepository', () => {
  let mockAdapter: ReturnType<typeof createMockStorageAdapter>;
  let repo: OnboardingRepository;

  const mockOnboarding = {
    completed: 1,
    goal: 'self_discovery',
    first_concept_viewed: 1,
  };

  beforeEach(() => {
    mockAdapter = createMockStorageAdapter();
    repo = new OnboardingRepository(mockAdapter as unknown as StorageAdapter);
  });

  afterEach(() => {
    mockAdapter._reset();
  });

  describe('get', () => {
    it('should return default when no onboarding record exists', async () => {
      const result = await repo.get();
      expect(result).toEqual(DEFAULT_ONBOARDING);
    });

    it('should return validated onboarding state', async () => {
      seedMockAdapter(mockAdapter, Collections.ONBOARDING, [
        { id: '1', record: mockOnboarding },
      ]);

      const result = await repo.get();
      expect(result.completed).toBe(1);
      expect(result.goal).toBe('self_discovery');
      expect(result.first_concept_viewed).toBe(1);
    });

    it('should return default for invalid data', async () => {
      seedMockAdapter(mockAdapter, Collections.ONBOARDING, [
        { id: '1', record: { completed: 5 } }, // Invalid: completed > 1
      ]);

      const result = await repo.get();
      expect(result).toEqual(DEFAULT_ONBOARDING);
    });

    it('should return default on adapter error', async () => {
      mockAdapter.getOne.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await repo.get();
      expect(result).toEqual(DEFAULT_ONBOARDING);
    });
  });

  describe('getState', () => {
    it('should return domain object with booleans', async () => {
      seedMockAdapter(mockAdapter, Collections.ONBOARDING, [
        { id: '1', record: mockOnboarding },
      ]);

      const result = await repo.getState();
      expect(result).toEqual({
        completed: true,
        goal: 'self_discovery',
        firstConceptViewed: true,
      });
    });

    it('should return default state when no record exists', async () => {
      const result = await repo.getState();
      expect(result).toEqual({
        completed: false,
        goal: null,
        firstConceptViewed: false,
      });
    });

    it('should handle incomplete onboarding', async () => {
      seedMockAdapter(mockAdapter, Collections.ONBOARDING, [
        { id: '1', record: { completed: 0, goal: null, first_concept_viewed: 0 } },
      ]);

      const result = await repo.getState();
      expect(result.completed).toBe(false);
      expect(result.goal).toBeNull();
      expect(result.firstConceptViewed).toBe(false);
    });
  });

  describe('update', () => {
    it('should update completed status', async () => {
      await repo.update({ completed: true });

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.ONBOARDING,
        '1',
        { completed: 1 }
      );
    });

    it('should update goal', async () => {
      await repo.update({ goal: 'partner_communication' });

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.ONBOARDING,
        '1',
        { goal: 'partner_communication' }
      );
    });

    it('should update firstConceptViewed', async () => {
      await repo.update({ firstConceptViewed: true });

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.ONBOARDING,
        '1',
        { first_concept_viewed: 1 }
      );
    });

    it('should update multiple fields at once', async () => {
      await repo.update({
        completed: true,
        goal: 'expanding_knowledge',
        firstConceptViewed: true,
      });

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.ONBOARDING,
        '1',
        {
          completed: 1,
          goal: 'expanding_knowledge',
          first_concept_viewed: 1,
        }
      );
    });

    it('should not call adapter if no updates provided', async () => {
      await repo.update({});

      expect(mockAdapter.update).not.toHaveBeenCalled();
    });

    it('should throw on adapter error', async () => {
      mockAdapter.update.mockRejectedValueOnce(new Error('Update failed'));

      await expect(repo.update({ completed: true })).rejects.toThrow('Update failed');
    });
  });

  describe('markCompleted', () => {
    it('should mark onboarding as completed', async () => {
      await repo.markCompleted();

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.ONBOARDING,
        '1',
        { completed: 1 }
      );
    });
  });

  describe('setGoal', () => {
    it('should set user goal', async () => {
      await repo.setGoal('self_discovery');

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.ONBOARDING,
        '1',
        { goal: 'self_discovery' }
      );
    });
  });

  describe('markFirstConceptViewed', () => {
    it('should mark first concept as viewed', async () => {
      await repo.markFirstConceptViewed();

      expect(mockAdapter.update).toHaveBeenCalledWith(
        Collections.ONBOARDING,
        '1',
        { first_concept_viewed: 1 }
      );
    });
  });

  describe('reset', () => {
    it('should delete all onboarding data', async () => {
      await repo.reset();

      expect(mockAdapter.deleteAll).toHaveBeenCalledWith(Collections.ONBOARDING);
    });

    it('should throw on adapter error', async () => {
      mockAdapter.deleteAll.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(repo.reset()).rejects.toThrow('Delete failed');
    });
  });
});
