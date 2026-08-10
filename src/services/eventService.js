import pool from "../config/db.js";

async function createEvent(event) {
  const { name, venue, starts_at, capacity } = event;

  const query = `
    INSERT INTO events
      (name, venue, starts_at, capacity, seats_remaining)
    VALUES
      ($1, $2, $3, $4, $4)
    RETURNING *;
  `;

  const values = [name, venue, starts_at, capacity];

  const { rows } = await pool.query(query, values);

  return rows[0];
}


async function getEvents(after = 0, limit = 10) {
  const query = `
    SELECT *
    FROM events
    WHERE id > $1
    ORDER BY id
    LIMIT $2;
  `;

  const values = [after, limit];

  const { rows } = await pool.query(query, values);

  return rows;
}


async function getEventById(id) {
  const query = `
    SELECT *
    FROM events
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0];
}


// Get bookings for one event using keyset pagination
async function getEventBookings(eventId, after = 0, limit = 10) {
  // Make sure the event exists
  const eventResult = await pool.query(
    `
    SELECT id
    FROM events
    WHERE id = $1;
    `,
    [eventId]
  );

  if (eventResult.rows.length === 0) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

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
    WHERE event_id = $1
      AND id > $2
    ORDER BY id ASC
    LIMIT $3;
    `,
    [eventId, after, limit]
  );

  return result.rows;
}


export default {
  createEvent,
  getEvents,
  getEventById,
  getEventBookings,
};