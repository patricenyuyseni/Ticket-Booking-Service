import express from "express";
import bookingController from "../controllers/bookingController.js";

const router = express.Router();

router.post("/:id/bookings", bookingController.createBooking);

export default router;