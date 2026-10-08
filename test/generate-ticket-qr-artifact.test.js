import test from "node:test";
import assert from "node:assert/strict";
import { generateTicketQrArtifact } from "../src/application/generate-ticket-qr-artifact.js";

const ticket = {
  id: "internal-id",
  ticketNumber: " tkt-1001 ",
  holderName: "Example Holder",
  eventName: "Example Event",
  quantity: 2,
  status: "ACTIVE",
};

test("generates a complete QR artifact for an active ticket", async () => {
  const result = await generateTicketQrArtifact(ticket, "2026-10-08T10:00:00.000Z");
  assert.deepEqual(
    { ticketNumber: result.ticketNumber, payloadVersion: result.payloadVersion, generatedAt: result.generatedAt, status: result.status, format: result.format },
    { ticketNumber: "TKT-1001", payloadVersion: "v1", generatedAt: "2026-10-08T10:00:00.000Z", status: "generated", format: "svg" },
  );
  assert.match(result.payloadHash, /^[a-f0-9]{64}$/);
  assert.match(result.qrSvg, /<svg[\\s\\S]*<\\/svg>/);
});

test("produces the same artifact metadata and QR for the same ticket", async () => {
  const first = await generateTicketQrArtifact(ticket, "2026-10-08T10:00:00.000Z");
  const second = await generateTicketQrArtifact(ticket, "2026-10-08T10:00:00.000Z");
  assert.equal(first.payloadHash, second.payloadHash);
  assert.equal(first.generatedAt, second.generatedAt);
  assert.equal(first.qrSvg, second.qrSvg);
});

test("does not generate artifacts for used or cancelled tickets", async () => {
  for (const status of ["used", "cancelled"]) {
    await assert.rejects(() => generateTicketQrArtifact({ ...ticket, status }), (error) => error.code === "INVALID_TICKET_STATUS");
  }
});
