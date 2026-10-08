import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("server contains required unhappy-path and telemetry contracts", async () => {
  const source = await readFile("./src/server.js", "utf8");
  assert.ok(source.includes('req.method === "POST"'));
  assert.ok(source.includes('req.url === "/api/tickets/qr"'));
  assert.ok(source.includes('message: "No data found."'));
  assert.ok(source.includes('[Analytics] User interacted with Ticket QR Code Generator Worker'));
});
