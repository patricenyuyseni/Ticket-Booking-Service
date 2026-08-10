import "dotenv/config";
import test from "node:test";
import assert from "node:assert/strict";

import app from "../src/app.js";
import pool from "../src/config/db.js";

const PORT = 3104;

let server;
let eventId;

test.before(async () => {
  server = app.listen(PORT);

  // Create a fresh event with only one seat.
  const result = await pool.query(
    `
    INSERT INTO events
      (name, venue, starts_at, capacity, seats_remaining, status)
    VALUES
      ($1, $2, $3, $4, $4, 'on_sale')
    RETURNING id;
    `,
    [
      "Concurrency Test Event",
      "Test Venue",
      new Date(Date.now() + 86400000),
      1,
    ]
  );

  eventId = result.rows[0].id;
});

test.after(async () => {
  if (eventId) {
    await pool.query(
      `
      DELETE FROM bookings
      WHERE event_id = $1;
      `,
      [eventId]
    );

    await pool.query(
      `
      DELETE FROM events
      WHERE id = $1;
      `,
      [eventId]
    );
  }

  server.close();

  await pool.end();
});

test("concurrent bookings cannot oversell the last seat", async () => {
  const bookingRequest = () =>
    fetch(`http://localhost:${PORT}/events/${eventId}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: 4,
        quantity: 1,
      }),
    });

  // Fire both requests at exactly the same time.
  const [response1, response2] = await Promise.all([
    bookingRequest(),
    bookingRequest(),
  ]);

  const statuses = [response1.status, response2.status].sort();

  // Exactly one booking must succeed and one must be rejected.
  assert.deepEqual(statuses, [201, 409]);

  // The event must never have a negative number of seats.
  const eventResult = await pool.query(
    `
    SELECT capacity, seats_remaining
    FROM events
    WHERE id = $1;
    `,
    [eventId]
  );

  assert.equal(eventResult.rows.length, 1);

  const event = eventResult.rows[0];

  assert.equal(event.capacity, 1);
  assert.equal(event.seats_remaining, 0);
  assert.ok(event.seats_remaining >= 0);
});