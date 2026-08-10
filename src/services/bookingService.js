import pool from "../config/db.js";

async function createBooking(eventId, customerId, quantity) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check that the event exists and lock it
    const eventResult = await client.query(
      `
      SELECT id, seats_remaining, status
      FROM events
      WHERE id = $1
      FOR UPDATE;
      `,
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    const event = eventResult.rows[0];

    // Do not allow bookings for cancelled events
    if (event.status === "cancelled") {
      const error = new Error("Event is cancelled");
      error.statusCode = 409;
      throw error;
    }

    // Check available seats
    if (event.seats_remaining < quantity) {
      const error = new Error("Not enough seats available");
      error.statusCode = 409;
      throw error;
    }

    // Reduce seats
    await client.query(
      `
      UPDATE events
      SET seats_remaining = seats_remaining - $1
      WHERE id = $2;
      `,
      [quantity, eventId]
    );

    // Create booking
    const bookingResult = await client.query(
      `
      INSERT INTO bookings
        (event_id, customer_id, quantity)
      VALUES
        ($1, $2, $3)
      RETURNING *;
      `,
      [eventId, customerId, quantity]
    );

    await client.query("COMMIT");

    return bookingResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");

    // Unknown customer
    if (error.code === "23503") {
      const customerError = new Error("Customer not found");
      customerError.statusCode = 400;
      throw customerError;
    }

    throw error;
  } finally {
    client.release();
  }
}


// Cancel a booking and restore the seats
async function cancelBooking(bookingId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock the booking row
    const bookingResult = await client.query(
      `
      SELECT id, event_id, quantity, status
      FROM bookings
      WHERE id = $1
      FOR UPDATE;
      `,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      throw error;
    }

    const booking = bookingResult.rows[0];

    // Already cancelled
    if (booking.status === "cancelled") {
      const error = new Error("Booking already cancelled");
      error.statusCode = 409;
      throw error;
    }

    // Lock the event
    const eventResult = await client.query(
      `
      SELECT id, seats_remaining
      FROM events
      WHERE id = $1
      FOR UPDATE;
      `,
      [booking.event_id]
    );

    if (eventResult.rows.length === 0) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    // Restore seats
    await client.query(
      `
      UPDATE events
      SET seats_remaining = seats_remaining + $1
      WHERE id = $2;
      `,
      [booking.quantity, booking.event_id]
    );

    // Mark booking as cancelled
    const updatedBooking = await client.query(
      `
      UPDATE bookings
      SET status = 'cancelled'
      WHERE id = $1
      RETURNING *;
      `,
      [bookingId]
    );

    await client.query("COMMIT");

    return updatedBooking.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}


async function getBookingById(id) {
  const result = await pool.query(
    `
    SELECT
      id,
      event_id,
      customer_id,
      quantity,
      status,
      booked_at
    FROM bookings
    WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0] || null;
}


async function getBookings() {
  const result = await pool.query(
    `
    SELECT
      id,
      event_id,
      customer_id,
      quantity,
      status,
      booked_at
    FROM bookings
    ORDER BY id ASC;
    `
  );

  return result.rows;
}


export default {
  createBooking,
  cancelBooking,
  getBookingById,
  getBookings,
};