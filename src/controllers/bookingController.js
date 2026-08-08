import bookingService from "../services/bookingService.js";

async function createBooking(req, res, next) {
  try {
    const eventId = Number(req.params.id);
    const { customer_id, quantity } = req.body;

    const booking = await bookingService.createBooking(
      eventId,
      customer_id,
      quantity
    );

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}

export default {
  createBooking,
};