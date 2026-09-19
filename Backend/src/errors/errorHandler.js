import { AppError } from "./AppError.js";
import { ErrorCodes } from "./errorCodes.js";
import { config } from "../config/env.js";
import { logger } from "../config/logger.js";

/**
 * 404 Route Not Found middleware
 */
export function notFoundHandler(req, res, next) {
  next(
    new AppError(`Route not found: ${req.method} ${req.originalUrl}`, {
      statusCode: 404,
      code: ErrorCodes.NOT_FOUND,
    })
  );
}

/**
 * Global Express Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let normalizedError = err;

  // Handle common external/library errors
  if (!(err instanceof AppError)) {
    // Malformed JSON body
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      normalizedError = new AppError("Malformed JSON in request body", {
        statusCode: 400,
        code: ErrorCodes.VALIDATION_ERROR,
      });
    }
    // CORS errors
    else if (err.message === "Not allowed by CORS") {
      normalizedError = new AppError("CORS request blocked", {
        statusCode: 403,
        code: ErrorCodes.FORBIDDEN,
      });
    }
    // Multer file upload errors
    else if (err.name === "MulterError") {
      normalizedError = new AppError(err.message, {
        statusCode: 400,
        code: ErrorCodes.VALIDATION_ERROR,
      });
    }
    // JWT verification errors
    else if (err.name === "TokenExpiredError") {
      normalizedError = new AppError("Authentication token expired", {
        statusCode: 401,
        code: ErrorCodes.TOKEN_EXPIRED,
      });
    } else if (err.name === "JsonWebTokenError") {
      normalizedError = new AppError("Invalid authentication token", {
        statusCode: 403,
        code: ErrorCodes.TOKEN_INVALID,
      });
    }
    // Generic fallback
    else {
      const statusCode = typeof err.status === "number" ? err.status : (typeof err.statusCode === "number" ? err.statusCode : 500);
      normalizedError = new AppError(err.message || "Internal server error", {
        statusCode,
        code: statusCode === 404 ? ErrorCodes.NOT_FOUND : ErrorCodes.INTERNAL_ERROR,
        isOperational: false,
      });
    }
  }

  const statusCode = normalizedError.statusCode || 500;
  const isOperational = normalizedError.isOperational;

  // Log non-operational bugs or 500 server errors
  if (!isOperational || statusCode >= 500) {
    logger.error(`Unhandled server error on ${req.method} ${req.originalUrl}`, err);
  }

  const message =
    config.isProd && !isOperational && statusCode >= 500
      ? "Internal server error"
      : normalizedError.message;

  const errorResponse = {
    code: normalizedError.code || ErrorCodes.INTERNAL_ERROR,
    message,
  };

  if (normalizedError.details) {
    errorResponse.details = normalizedError.details;
  }

  if (!config.isProd && err.stack) {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json({
    success: false,
    message, // Preserves backward compatibility for legacy clients
    error: errorResponse,
  });
}
