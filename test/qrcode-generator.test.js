import test from "node:test";
import assert from "node:assert/strict";
import { buildQrPayload } from "../src/domain/qr-payload.js";
import { generateQrSvg } from "../src/infrastructure/qr/qrcode-generator.js";

const ticket = {
  ticketNumber: "TKT-1001",
  holderName: "Sumit Joshi",
  eventName: "Tech Conference",
  quantity: 2,
  status: "active",
};

test("generates a valid SVG QR document from the ticket payload", async () => {
  const payload = buildQrPayload(ticket);
  const svg = await generateQrSvg(payload);

  assert.match(svg, /^<svg[\\s\\S]*<\/svg>$/);
  assert.match(svg, /viewBox=/);
  assert.match(svg, /<path/);
});

test("generates deterministic QR output for the same payload", async () => {
  const payload = buildQrPayload(ticket);
  const first = await generateQrSvg(payload);
  const second = await generateQrSvg(payload);

  assert.equal(first, second);
});

test("does not accept null payloads", async () => {
  await assert.rejects(
    () => generateQrSvg(null),
    {
      name: "TypeError",
      message: "QR payload must be a non-null object.",
    },
  );
});
