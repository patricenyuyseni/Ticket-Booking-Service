import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

const swaggerDocument = YAML.load("./docs/openapi.yaml");

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
  });
});

// Swagger API documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Booking routes must come before event /:id routes
app.use("/events", bookingRoutes);
app.use("/events", eventRoutes);

app.use(errorHandler);

export default app;