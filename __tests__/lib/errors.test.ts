// Tests for custom error classes and helper functions

import {
  DatabaseError,
  ValidationError,
  NotFoundError,
  StorageError,
  isDatabaseError,
  isValidationError,
  isNotFoundError,
  isStorageError,
  getErrorMessage,
  wrapError,
} from '@/lib/errors';

describe('DatabaseError', () => {
  it('should create error with correct properties', () => {
    const error = new DatabaseError('Connection failed', 'connect');
    expect(error.message).toBe('Connection failed');
    expect(error.operation).toBe('connect');
    expect(error.name).toBe('DatabaseError');
    expect(error.cause).toBeUndefined();
  });

  it('should include cause when provided', () => {
    const cause = new Error('Original error');
    const error = new DatabaseError('Query failed', 'query', cause);
    expect(error.cause).toBe(cause);
  });

  it('should serialize to JSON correctly', () => {
    const cause = new Error('Original');
    const error = new DatabaseError('Test error', 'test', cause);
    const json = error.toJSON();

    expect(json.name).toBe('DatabaseError');
    expect(json.message).toBe('Test error');
    expect(json.operation).toBe('test');
    expect(json.cause).toBe('Original');
  });

  it('should serialize non-Error cause as-is', () => {
    const error = new DatabaseError('Test error', 'test', 'string cause');
    const json = error.toJSON();
    expect(json.cause).toBe('string cause');
  });

  it('should be an instance of Error', () => {
    const error = new DatabaseError('Test', 'test');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DatabaseError);
  });
});

describe('ValidationError', () => {
  it('should create error with correct properties', () => {
    const error = new ValidationError('Invalid value', 'status', 'bad_value');
    expect(error.message).toBe('Invalid value');
    expect(error.field).toBe('status');
    expect(error.value).toBe('bad_value');
    expect(error.name).toBe('ValidationError');
  });

  it('should include issues when provided', () => {
    const issues = [
      { path: 'status', message: 'Invalid enum value' },
      { path: 'id', message: 'Required' },
    ];
    const error = new ValidationError('Validation failed', 'data', {}, issues);
    expect(error.issues).toEqual(issues);
  });

  it('should serialize to JSON correctly', () => {
    const issues = [{ path: 'field', message: 'error' }];
    const error = new ValidationError('Test', 'field', 'value', issues);
    const json = error.toJSON();

    expect(json.name).toBe('ValidationError');
    expect(json.field).toBe('field');
    expect(json.value).toBe('value');
    expect(json.issues).toEqual(issues);
  });

  it('should serialize object values as [object]', () => {
    const error = new ValidationError('Test', 'field', { complex: 'object' });
    const json = error.toJSON();
    expect(json.value).toBe('[object]');
  });
});

describe('NotFoundError', () => {
  it('should create error with auto-generated message', () => {
    const error = new NotFoundError('Concept', 'abc123');
    expect(error.message).toBe("Concept with id 'abc123' not found");
    expect(error.entity).toBe('Concept');
    expect(error.id).toBe('abc123');
    expect(error.name).toBe('NotFoundError');
  });

  it('should serialize to JSON correctly', () => {
    const error = new NotFoundError('User', 'user-456');
    const json = error.toJSON();

    expect(json.name).toBe('NotFoundError');
    expect(json.entity).toBe('User');
    expect(json.id).toBe('user-456');
    expect(json.message).toContain('User');
    expect(json.message).toContain('user-456');
  });
});

describe('StorageError', () => {
  it('should create error with correct properties', () => {
    const error = new StorageError('Quota exceeded', 'sqlite');
    expect(error.message).toBe('Quota exceeded');
    expect(error.storageType).toBe('sqlite');
    expect(error.name).toBe('StorageError');
  });

  it('should accept asyncstorage type', () => {
    const error = new StorageError('Storage unavailable', 'asyncstorage');
    expect(error.storageType).toBe('asyncstorage');
  });

  it('should accept unknown type', () => {
    const error = new StorageError('Unknown storage error', 'unknown');
    expect(error.storageType).toBe('unknown');
  });

  it('should include cause when provided', () => {
    const cause = new Error('Disk full');
    const error = new StorageError('Write failed', 'sqlite', cause);
    expect(error.cause).toBe(cause);
  });

  it('should serialize to JSON correctly', () => {
    const cause = new Error('Original');
    const error = new StorageError('Test', 'sqlite', cause);
    const json = error.toJSON();

    expect(json.name).toBe('StorageError');
    expect(json.storageType).toBe('sqlite');
    expect(json.cause).toBe('Original');
  });
});

describe('Type Guards', () => {
  describe('isDatabaseError', () => {
    it('should return true for DatabaseError', () => {
      const error = new DatabaseError('Test', 'test');
      expect(isDatabaseError(error)).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(isDatabaseError(new Error('Test'))).toBe(false);
      expect(isDatabaseError(new ValidationError('Test', 'field', 'value'))).toBe(false);
      expect(isDatabaseError('string')).toBe(false);
      expect(isDatabaseError(null)).toBe(false);
    });
  });

  describe('isValidationError', () => {
    it('should return true for ValidationError', () => {
      const error = new ValidationError('Test', 'field', 'value');
      expect(isValidationError(error)).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(isValidationError(new Error('Test'))).toBe(false);
      expect(isValidationError(new DatabaseError('Test', 'op'))).toBe(false);
    });
  });

  describe('isNotFoundError', () => {
    it('should return true for NotFoundError', () => {
      const error = new NotFoundError('Entity', 'id');
      expect(isNotFoundError(error)).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(isNotFoundError(new Error('Test'))).toBe(false);
      expect(isNotFoundError(undefined)).toBe(false);
    });
  });

  describe('isStorageError', () => {
    it('should return true for StorageError', () => {
      const error = new StorageError('Test', 'sqlite');
      expect(isStorageError(error)).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(isStorageError(new Error('Test'))).toBe(false);
      expect(isStorageError({})).toBe(false);
    });
  });
});

describe('getErrorMessage', () => {
  it('should extract message from Error', () => {
    const error = new Error('Test message');
    expect(getErrorMessage(error)).toBe('Test message');
  });

  it('should extract message from custom errors', () => {
    expect(getErrorMessage(new DatabaseError('DB error', 'op'))).toBe('DB error');
    expect(getErrorMessage(new ValidationError('Val error', 'f', 'v'))).toBe('Val error');
    expect(getErrorMessage(new NotFoundError('E', 'id'))).toBe("E with id 'id' not found");
  });

  it('should return string as-is', () => {
    expect(getErrorMessage('String error')).toBe('String error');
  });

  it('should return fallback for non-error values', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred');
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
    expect(getErrorMessage(123)).toBe('An unexpected error occurred');
    expect(getErrorMessage({ some: 'object' })).toBe('An unexpected error occurred');
  });
});

describe('wrapError', () => {
  it('should return DatabaseError as-is', () => {
    const original = new DatabaseError('Original', 'original-op');
    const wrapped = wrapError(original, 'new-op');

    // Should return the same instance, not wrap it
    expect(wrapped).toBe(original);
    expect(wrapped.operation).toBe('original-op');
  });

  it('should wrap regular Error in DatabaseError', () => {
    const original = new Error('Original error');
    const wrapped = wrapError(original, 'test-op');

    expect(wrapped).toBeInstanceOf(DatabaseError);
    expect(wrapped.message).toBe('Original error');
    expect(wrapped.operation).toBe('test-op');
    expect(wrapped.cause).toBe(original);
  });

  it('should wrap string in DatabaseError', () => {
    const wrapped = wrapError('String error', 'string-op');

    expect(wrapped).toBeInstanceOf(DatabaseError);
    expect(wrapped.message).toBe('String error');
    expect(wrapped.operation).toBe('string-op');
    expect(wrapped.cause).toBe('String error');
  });

  it('should wrap unknown values with fallback message', () => {
    const wrapped = wrapError(null, 'null-op');

    expect(wrapped).toBeInstanceOf(DatabaseError);
    expect(wrapped.message).toBe('An unexpected error occurred');
    expect(wrapped.operation).toBe('null-op');
  });

  it('should preserve other custom errors as cause', () => {
    const validation = new ValidationError('Invalid', 'field', 'value');
    const wrapped = wrapError(validation, 'wrap-op');

    expect(wrapped).toBeInstanceOf(DatabaseError);
    expect(wrapped.message).toBe('Invalid');
    expect(wrapped.cause).toBe(validation);
  });
});
