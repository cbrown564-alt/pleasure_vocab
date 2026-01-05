// Unique ID generation utilities
// Uses nanoid for collision-resistant IDs

import { nanoid } from 'nanoid/non-secure';

/**
 * Generates a unique ID using nanoid.
 * Default length is 21 characters (same as nanoid default).
 *
 * Benefits over Date.now() + random:
 * - No collisions even under rapid successive calls
 * - URL-safe characters (A-Za-z0-9_-)
 * - Shorter and more compact
 * - Cryptographically random (when using secure version)
 *
 * Note: Using non-secure version for React Native compatibility.
 * For most app use cases, this provides sufficient uniqueness.
 */
export function generateId(size: number = 21): string {
  return nanoid(size);
}

/**
 * Generates a shorter ID (12 characters).
 * Suitable for human-readable references where full uniqueness
 * guarantees aren't critical.
 */
export function generateShortId(): string {
  return nanoid(12);
}

// ============ Testing Support ============

type IdGenerator = (size?: number) => string;

let currentGenerator: IdGenerator = nanoid;

/**
 * Override the ID generator for testing purposes.
 * Allows deterministic IDs in test environments.
 *
 * @example
 * // In tests:
 * let counter = 0;
 * setIdGenerator(() => `test-id-${++counter}`);
 */
export function setIdGenerator(generator: IdGenerator): void {
  currentGenerator = generator;
}

/**
 * Reset to the default nanoid generator.
 */
export function resetIdGenerator(): void {
  currentGenerator = nanoid;
}

/**
 * Generate ID using the current generator (default or overridden).
 * Use this in code that needs to be testable with deterministic IDs.
 */
export function generateTestableId(size: number = 21): string {
  return currentGenerator(size);
}
