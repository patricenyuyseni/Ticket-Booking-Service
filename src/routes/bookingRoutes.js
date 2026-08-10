import express from "express";
import bookingController from "../controllers/bookingController.js";

const router = express.Router();

router.post("/:id/bookings", bookingController.createBooking);

router.post("/bookings/:id/cancel", bookingController.cancelBooking);

router.get("/bookings", bookingController.getBookings);

router.get("/bookings/:bookingId", bookingController.getBookingById);

export default router;