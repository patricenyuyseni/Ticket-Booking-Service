import express from "express";
import eventController from "../controllers/eventController.js";

const router = express.Router();

router.get("/", eventController.getEvents);
router.get("/:id/bookings", eventController.getEventBookings);
router.get("/:id", eventController.getEventById);
router.post("/", eventController.createEvent);

export default router;