const express = require("express");
const eventRoutes = require("./routes/eventRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
  });
});

app.use("/events", eventRoutes);

app.use(errorHandler);

module.exports = app;