import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/errorCodes.js";

/**
 * Validates request payload against Zod schema objects.
 * Supports both { body: schema, query: schema, params: schema }
 * and passing a raw Zod schema directly (defaults to validating body).
 * Populates req.validated as well as req[target] with sanitized data.
 *
 * @param {object|import('zod').ZodTypeAny} schemas
 */
export function validateRequest(schemas) {
  const normalizedSchemas =
    schemas && (schemas.body || schemas.query || schemas.params)
      ? schemas
      : { body: schemas };

  return async (req, res, next) => {
    try {
      const details = [];

      for (const target of ["body", "query", "params"]) {
        if (normalizedSchemas[target]) {
          const result = normalizedSchemas[target].safeParse(req[target]);
          if (!result.success) {
            for (const issue of result.error.issues) {
              details.push({
                field: issue.path.join(".") || target,
                message: issue.message,
              });
            }
          } else {
            req[target] = result.data;
            if (target === "body") {
              req.validated = result.data;
            }
          }
        }
      }

      if (details.length > 0) {
        throw new AppError(details[0].message, {
          statusCode: 400,
          code: ErrorCodes.VALIDATION_ERROR,
          details,
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
