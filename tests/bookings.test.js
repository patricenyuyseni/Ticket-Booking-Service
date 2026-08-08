import "dotenv/config";
import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";
import pool from "../src/config/db.js";

const PORT = 3102;

let server;

test.before(async () => {
  server = app.listen(PORT);
});

test.after(async () => {
  server.close();
  await pool.end();
});

test("GET /events/bookings returns bookings", async () => {
  const response = await fetch(
    `http://localhost:${PORT}/events/bookings`
  );

  assert.equal(response.status, 200);

  const data = await response.json();

  assert.ok(Array.isArray(data.data));
});
