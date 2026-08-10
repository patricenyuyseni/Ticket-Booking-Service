import { createBookingSchema } from "../validation/bookingSchema.js";
import bookingService from "../services/bookingService.js";

async function createBooking(req, res, next) {
  try {
    const eventId = Number(req.params.id);

    const data = createBookingSchema.parse(req.body);

    const booking = await bookingService.createBooking(
      eventId,
      data.customer_id,
      data.quantity
    );

    res
      .status(201)
      .location(`/events/bookings/${booking.id}`)
      .json(booking);
  } catch (error) {
    next(error);
  }
}


async function cancelBooking(req, res, next) {
  try {
    const bookingId = Number(req.params.id);

    if (Number.isNaN(bookingId)) {
      const error = new Error("Invalid booking ID");
      error.statusCode = 400;
      throw error;
    }

    await bookingService.cancelBooking(bookingId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}


async function getBookings(req, res, next) {
  try {
    const bookings = await bookingService.getBookings();

    res.status(200).json({
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}


async function getBookingById(req, res, next) {
  try {
    const bookingId = Number(req.params.bookingId);

    if (Number.isNaN(bookingId)) {
      const error = new Error("Invalid booking ID");
      error.statusCode = 400;
      throw error;
    }

    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
}


export default {
  createBooking,
  cancelBooking,
  getBookings,
  getBookingById,
};