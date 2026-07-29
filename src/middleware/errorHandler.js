const { ZodError } = require("zod");

function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues,
    });
  }

  console.error(err);

  return res.status(500).json({
    error: "Internal server error",
  });
}

module.exports = errorHandler;