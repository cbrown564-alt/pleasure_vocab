// Centralized logging utility
// Provides structured logging with context and optional remote reporting

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMeta {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  context: string;
  message: string;
  meta?: LogMeta;
  timestamp: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// ============ Configuration ============

interface LoggerConfig {
  /** Minimum level to log (debug < info < warn < error) */
  minLevel: LogLevel;
  /** Whether to include timestamps in console output */
  showTimestamp: boolean;
  /** Optional callback for remote error reporting */
  onError?: (entry: LogEntry) => void;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let config: LoggerConfig = {
  minLevel: __DEV__ ? 'debug' : 'warn',
  showTimestamp: false,
};

/**
 * Configure the logger settings.
 */
export function configureLogger(newConfig: Partial<LoggerConfig>): void {
  config = { ...config, ...newConfig };
}

// ============ Core Logging ============

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[config.minLevel];
}

function formatError(error: unknown): LogEntry['error'] | undefined {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  if (error !== undefined) {
    return {
      name: 'UnknownError',
      message: String(error),
    };
  }
  return undefined;
}

function createEntry(
  level: LogLevel,
  context: string,
  message: string,
  meta?: LogMeta,
  error?: unknown
): LogEntry {
  return {
    level,
    context,
    message,
    meta,
    timestamp: new Date().toISOString(),
    error: formatError(error),
  };
}

function logToConsole(entry: LogEntry): void {
  const prefix = config.showTimestamp
    ? `[${entry.timestamp}] [${entry.context}]`
    : `[${entry.context}]`;

  const args: unknown[] = [prefix, entry.message];

  if (entry.meta && Object.keys(entry.meta).length > 0) {
    args.push(entry.meta);
  }

  if (entry.error) {
    args.push(entry.error);
  }

  switch (entry.level) {
    case 'debug':
      console.debug(...args);
      break;
    case 'info':
      console.info(...args);
      break;
    case 'warn':
      console.warn(...args);
      break;
    case 'error':
      console.error(...args);
      break;
  }
}

// ============ Public API ============

export const logger = {
  /**
   * Log debug information (development only by default).
   */
  debug(context: string, message: string, meta?: LogMeta): void {
    if (!shouldLog('debug')) return;
    const entry = createEntry('debug', context, message, meta);
    logToConsole(entry);
  },

  /**
   * Log general information.
   */
  info(context: string, message: string, meta?: LogMeta): void {
    if (!shouldLog('info')) return;
    const entry = createEntry('info', context, message, meta);
    logToConsole(entry);
  },

  /**
   * Log warnings (non-critical issues).
   */
  warn(context: string, message: string, meta?: LogMeta): void {
    if (!shouldLog('warn')) return;
    const entry = createEntry('warn', context, message, meta);
    logToConsole(entry);
  },

  /**
   * Log errors with optional error object.
   */
  error(context: string, message: string, error?: unknown, meta?: LogMeta): void {
    if (!shouldLog('error')) return;
    const entry = createEntry('error', context, message, meta, error);
    logToConsole(entry);

    // Trigger remote error reporting if configured
    if (config.onError) {
      try {
        config.onError(entry);
      } catch {
        // Don't let error reporting failures break the app
        console.error('[Logger] Failed to report error remotely');
      }
    }
  },

  /**
   * Create a scoped logger for a specific context.
   * Reduces boilerplate when logging from a single module.
   */
  scope(context: string) {
    return {
      debug: (message: string, meta?: LogMeta) => logger.debug(context, message, meta),
      info: (message: string, meta?: LogMeta) => logger.info(context, message, meta),
      warn: (message: string, meta?: LogMeta) => logger.warn(context, message, meta),
      error: (message: string, error?: unknown, meta?: LogMeta) =>
        logger.error(context, message, error, meta),
    };
  },
};

// ============ Database-Specific Helpers ============

const dbLogger = logger.scope('Database');

/**
 * Log a database operation error with context.
 */
export function logDatabaseError(
  operation: string,
  error: unknown,
  meta?: LogMeta
): void {
  dbLogger.error(`${operation} failed`, error, meta);
}

/**
 * Log a validation warning with context.
 */
export function logValidationWarning(
  context: string,
  issues: Array<{ path: string; message: string }>
): void {
  dbLogger.warn(`Validation failed in ${context}`, { issues });
}

/**
 * Execute an async operation with automatic error logging.
 * Returns the result on success, or the fallback on error.
 */
export async function safeExecute<T>(
  operation: string,
  fn: () => Promise<T>,
  fallback: T,
  meta?: LogMeta
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logDatabaseError(operation, error, meta);
    return fallback;
  }
}

/**
 * Execute an async operation with automatic error logging.
 * Returns { data, error } tuple for explicit error handling.
 */
export async function safeExecuteWithError<T>(
  operation: string,
  fn: () => Promise<T>,
  meta?: LogMeta
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    logDatabaseError(operation, error, meta);
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
