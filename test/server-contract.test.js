import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("server exposes required unhappy-path and telemetry contracts", async () => {
  const source = await readFile("./src/server.js", "utf8");
  assert.match(source, /POST.*\\/api\\/tickets\\/qr/);
  assert.match(source, /No data found/);
  assert.match(source, /\\[Analytics\\] User interacted with Ticket QR Code Generator Worker/);
});
