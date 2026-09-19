/**
 * Unwraps successful API response payloads
 */
export function unwrapResponse(response) {
  if (response && response.data !== undefined) {
    if (response.data && typeof response.data === "object" && "data" in response.data) {
      return response.data.data;
    }
    return response.data;
  }
  return response;
}

/**
 * Extracts a user-friendly error message from standard or legacy error responses
 */
export function getErrorMessage(err, fallback = "An unexpected error occurred") {
  if (!err) return fallback;
  if (err.response?.data?.error?.message) {
    return err.response.data.error.message;
  }
  if (err.response?.data?.message) {
    return err.response.data.message;
  }
  if (err.response?.data?.error && typeof err.response.data.error === "string") {
    return err.response.data.error;
  }
  if (err.message) {
    return err.message;
  }
  return fallback;
}
