// Custom error types for database operations
// Provides context-rich errors for debugging and error reporting

/**
 * Base error class for all database-related errors.
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public operation: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      operation: this.operation,
      cause: this.cause instanceof Error ? this.cause.message : this.cause,
    };
  }
}

/**
 * Error thrown when data validation fails.
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown,
    public issues?: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      field: this.field,
      value: typeof this.value === 'object' ? '[object]' : this.value,
      issues: this.issues,
    };
  }
}

/**
 * Error thrown when a required record is not found.
 */
export class NotFoundError extends Error {
  constructor(
    public entity: string,
    public id: string
  ) {
    super(`${entity} with id '${id}' not found`);
    this.name = 'NotFoundError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      entity: this.entity,
      id: this.id,
    };
  }
}

/**
 * Error thrown when storage quota is exceeded or storage is unavailable.
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public storageType: 'sqlite' | 'asyncstorage' | 'unknown',
    public cause?: unknown
  ) {
    super(message);
    this.name = 'StorageError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StorageError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      storageType: this.storageType,
      cause: this.cause instanceof Error ? this.cause.message : this.cause,
    };
  }
}

// ============ Error Helpers ============

/**
 * Type guard to check if an error is a DatabaseError.
 */
export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError;
}

/**
 * Type guard to check if an error is a ValidationError.
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Type guard to check if an error is a NotFoundError.
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

/**
 * Type guard to check if an error is a StorageError.
 */
export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}

/**
 * Extracts a user-friendly message from any error.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Wraps an unknown error in a DatabaseError with context.
 */
export function wrapError(error: unknown, operation: string): DatabaseError {
  if (error instanceof DatabaseError) {
    return error;
  }
  const message = getErrorMessage(error);
  return new DatabaseError(message, operation, error);
}
