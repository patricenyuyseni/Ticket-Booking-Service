import express from "express";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
  });
});

// Booking routes must come before event /:id routes
app.use("/events", bookingRoutes);
app.use("/events", eventRoutes);

app.use(errorHandler);

export default app;