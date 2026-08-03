const pool = require("../config/db");

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

module.exports = {
  createEvent,
  getEvents,
};