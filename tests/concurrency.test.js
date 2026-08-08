import "dotenv/config";
import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

const PORT = 3104;

let server;

test.before(async () => {
  server = app.listen(PORT);
});

test.after(async () => {
  server.close();
});

test("booking more seats than available is rejected", async () => {
  const response = await fetch(
    `http://localhost:${PORT}/events/1/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: 4,
        quantity: 999999,
      }),
    }
  );

  assert.equal(response.status, 409);

  const data = await response.json();

  assert.equal(data.error, "Not enough seats available");
});

