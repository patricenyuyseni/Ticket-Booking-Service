import pool from "../config/db.js";

async function createBooking(eventId, customerId, quantity) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const eventResult = await client.query(
      `
      SELECT id, seats_remaining
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

    if (event.seats_remaining < quantity) {
      const error = new Error("Not enough seats available");
      error.statusCode = 409;
      throw error;
    }

    await client.query(
      `
      UPDATE events
      SET seats_remaining = seats_remaining - $1
      WHERE id = $2;
      `,
      [quantity, eventId]
    );

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

    if (error.code === "23503") {
      const customerError = new Error("Customer not found");
      customerError.statusCode = 404;
      throw customerError;
    }

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
  getBookingById,
  getBookings,
};

