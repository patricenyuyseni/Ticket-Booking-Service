import "dotenv/config";
import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

const PORT = 3103;

let server;

test.before(async () => {
  server = app.listen(PORT);
});

test.after(async () => {
  server.close();
});

test("booking with invalid quantity returns 400", async () => {
  const response = await fetch(
    `http://localhost:${PORT}/events/1/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: 4,
        quantity: 0,
      }),
    }
  );

  assert.equal(response.status, 400);

  const data = await response.json();

  assert.equal(data.error, "Validation failed");
});

test("booking with nonexistent customer returns 404", async () => {
  const response = await fetch(
    `http://localhost:${PORT}/events/1/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: 999999,
        quantity: 1,
      }),
    }
  );

  assert.equal(response.status, 404);

  const data = await response.json();

  assert.equal(data.error, "Customer not found");
});
