export const handleError = (res, error, statusCode = 500) => {
  // Default message for common HTTP status codes
  const statusMessages = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    422: "Unprocessable Entity",
    500: "Internal Server Error"
  };

  // Capture the provided error message or use the default based on status code
  const errorMessage =
    error.message ||
    statusMessages[statusCode] ||
    "An unexpected error occurred";

  // Log the error for server debugging (don't expose internal errors to the client)
  console.error({
    statusCode,
    message: errorMessage,
    stack: error.stack || "No stack available"
  });

  // Build response data (omit internal details like stack trace from response)
  const responseData = {
    success: false,
    statusCode,
    message: errorMessage
  };

  // Optionally, include validation errors or additional information for 4xx status codes
  if (statusCode >= 400 && statusCode < 500 && error.errors) {
    responseData.errors = error.errors; // Field validation errors, if any
  }

  // Return the appropriate HTTP response with structured error details
  return res.status(statusCode).json(responseData);
};
