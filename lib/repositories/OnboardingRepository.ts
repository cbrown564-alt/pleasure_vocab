// Onboarding Repository
// Handles onboarding state operations with validation

import { OnboardingState, UserGoal } from '@/types';
import { logger } from '../logger';
import { Collections, StorageAdapter } from '../storage';
import {
  DEFAULT_ONBOARDING,
  OnboardingRowSchema,
  validateWithFallback,
  ValidatedOnboardingRow,
} from '../validation';

const log = logger.scope('OnboardingRepository');

/**
 * Repository for onboarding state operations.
 */
export class OnboardingRepository {
  constructor(private adapter: StorageAdapter) {}

  /**
   * Get the current onboarding state.
   */
  async get(): Promise<ValidatedOnboardingRow> {
    try {
      const raw = await this.adapter.getOne<unknown>(Collections.ONBOARDING, '1');
      if (!raw) return DEFAULT_ONBOARDING;

      return validateWithFallback(
        OnboardingRowSchema,
        raw,
        DEFAULT_ONBOARDING,
        'OnboardingRepository.get'
      );
    } catch (error) {
      log.error('Failed to get onboarding state', error);
      return DEFAULT_ONBOARDING;
    }
  }

  /**
   * Get the onboarding state as a domain object.
   */
  async getState(): Promise<OnboardingState> {
    const row = await this.get();
    return {
      completed: row.completed === 1,
      goal: row.goal as UserGoal | null,
      firstConceptViewed: row.first_concept_viewed === 1,
    };
  }

  /**
   * Update onboarding state.
   */
  async update(updates: {
    completed?: boolean;
    goal?: UserGoal;
    firstConceptViewed?: boolean;
  }): Promise<void> {
    try {
      const updateData: Record<string, unknown> = {};

      if (updates.completed !== undefined) {
        updateData.completed = updates.completed ? 1 : 0;
      }
      if (updates.goal !== undefined) {
        updateData.goal = updates.goal;
      }
      if (updates.firstConceptViewed !== undefined) {
        updateData.first_concept_viewed = updates.firstConceptViewed ? 1 : 0;
      }

      if (Object.keys(updateData).length > 0) {
        await this.adapter.update(Collections.ONBOARDING, '1', updateData);
      }
    } catch (error) {
      log.error('Failed to update onboarding', error, { updates });
      throw error;
    }
  }

  /**
   * Mark onboarding as completed.
   */
  async markCompleted(): Promise<void> {
    await this.update({ completed: true });
  }

  /**
   * Set user's goal.
   */
  async setGoal(goal: UserGoal): Promise<void> {
    await this.update({ goal });
  }

  /**
   * Mark first concept as viewed.
   */
  async markFirstConceptViewed(): Promise<void> {
    await this.update({ firstConceptViewed: true });
  }

  /**
   * Reset onboarding state.
   */
  async reset(): Promise<void> {
    try {
      await this.adapter.deleteAll(Collections.ONBOARDING);
    } catch (error) {
      log.error('Failed to reset onboarding', error);
      throw error;
    }
  }
}
