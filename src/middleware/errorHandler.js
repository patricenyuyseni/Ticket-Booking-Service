import { ZodError } from "zod";

function errorHandler(err, req, res, next) {

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues,
    });
  }

  console.error(err);

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    error: err.message || "Internal server error",
  });
}

export default errorHandler;