import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/errorCodes.js";

/**
 * Validates request payload against Zod schema objects
 * @param {object} schemas
 * @param {import('zod').ZodTypeAny} [schemas.body]
 * @param {import('zod').ZodTypeAny} [schemas.query]
 * @param {import('zod').ZodTypeAny} [schemas.params]
 */
export function validateRequest(schemas) {
  return async (req, res, next) => {
    try {
      const details = [];

      for (const target of ["body", "query", "params"]) {
        if (schemas[target]) {
          const result = schemas[target].safeParse(req[target]);
          if (!result.success) {
            for (const issue of result.error.issues) {
              details.push({
                field: issue.path.join(".") || target,
                message: issue.message,
              });
            }
          } else {
            req[target] = result.data;
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
