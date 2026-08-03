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

export default {
  createEvent,
  getEvents,
  getEventById,
};