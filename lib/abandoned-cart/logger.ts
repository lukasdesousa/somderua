type LogValue = string | number | boolean | null | undefined;
type LogContext = Record<string, LogValue>;

function sanitizeContext(context: LogContext = {}): LogContext {
  return Object.fromEntries(
    Object.entries(context).filter(([, value]) => value !== undefined),
  );
}

function serializeError(error: unknown): LogContext {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
    };
  }

  return { errorMessage: "Unknown error" };
}

export const abandonedCartLogger = {
  info(event: string, context?: LogContext) {
    console.info(`[abandoned-cart] ${event}`, sanitizeContext(context));
  },

  warn(event: string, context?: LogContext) {
    console.warn(`[abandoned-cart] ${event}`, sanitizeContext(context));
  },

  error(event: string, error: unknown, context?: LogContext) {
    console.error(`[abandoned-cart] ${event}`, {
      ...sanitizeContext(context),
      ...serializeError(error),
    });
  },
};
