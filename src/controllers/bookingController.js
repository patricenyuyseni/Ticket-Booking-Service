import { createBookingSchema } from "../validation/bookingSchema.js";
import bookingService from "../services/bookingService.js";

async function createBooking(req, res, next) {
  try {
    const eventId = Number(req.params.id);

    // Validate the request body before touching the database
    const data = createBookingSchema.parse(req.body);

    const booking = await bookingService.createBooking(
      eventId,
      data.customer_id,
      data.quantity
    );

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}

export default {
  createBooking,
};