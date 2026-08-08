import "dotenv/config";
import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

const PORT = 3101;

let server;

test.before(async () => {
  server = app.listen(PORT);
});

test.after(async () => {
  server.close();
});

test("GET /health returns healthy status", async () => {
  const response = await fetch(`http://localhost:${PORT}/health`);

  assert.equal(response.status, 200);

  const data = await response.json();

  assert.equal(data.status, "ok");
});
