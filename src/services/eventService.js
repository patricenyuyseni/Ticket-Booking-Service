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

module.exports = {
  createEvent,
};