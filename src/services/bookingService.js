import pool from "../config/db.js";

async function createBooking(eventId, customerId, quantity) {
  const client = await pool.connect();

  try {
    // Start the database transaction
    await client.query("BEGIN");

    // Check that the event exists and lock the row
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

    // Check whether enough seats are available
    if (event.seats_remaining < quantity) {
      const error = new Error("Not enough seats available");
      error.statusCode = 409;
      throw error;
    }

    // Reduce the number of remaining seats
    await client.query(
      `
      UPDATE events
      SET seats_remaining = seats_remaining - $1
      WHERE id = $2;
      `,
      [quantity, eventId]
    );

    // Create the booking
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

    // Everything succeeded
    await client.query("COMMIT");

    return bookingResult.rows[0];
  } catch (error) {
    // Something failed, undo everything
    await client.query("ROLLBACK");

    // PostgreSQL foreign-key violation
    if (error.code === "23503") {
      const customerError = new Error("Customer not found");
      customerError.statusCode = 404;
      throw customerError;
    }

    throw error;
  } finally {
    // Return the connection to the pool
    client.release();
  }
}

export default {
  createBooking,
};