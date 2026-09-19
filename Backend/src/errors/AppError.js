/**
 * Custom application error class with structured metadata
 * for operational and programmer errors.
 */
export class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {object} [options]
   * @param {number} [options.statusCode=500] - HTTP status code
   * @param {string} [options.code='INTERNAL_ERROR'] - Machine-readable error code
   * @param {any} [options.details=null] - Additional validation or contextual details
   * @param {boolean} [options.isOperational=true] - True for expected operational errors, false for bugs
   */
  constructor(message, { statusCode = 500, code = "INTERNAL_ERROR", details = null, isOperational = true } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, code = "VALIDATION_ERROR", details = null) {
    return new AppError(message, { statusCode: 400, code, details });
  }

  static unauthorized(message = "Authentication required", code = "UNAUTHORIZED") {
    return new AppError(message, { statusCode: 401, code });
  }

  static forbidden(message = "Access denied", code = "FORBIDDEN") {
    return new AppError(message, { statusCode: 403, code });
  }

  static notFound(message = "Resource not found", code = "NOT_FOUND") {
    return new AppError(message, { statusCode: 404, code });
  }

  static conflict(message, code = "CONFLICT") {
    return new AppError(message, { statusCode: 409, code });
  }

  static tooManyRequests(message = "Too many requests, please try again later", code = "RATE_LIMITED") {
    return new AppError(message, { statusCode: 429, code });
  }

  static internal(message = "Internal server error", code = "INTERNAL_ERROR") {
    return new AppError(message, { statusCode: 500, code, isOperational: false });
  }
}
