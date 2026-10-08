import test from "node:test";
import assert from "node:assert/strict";
import { createGenerationRecord } from "../src/domain/generation-record.js";
import { InMemoryGenerationRepository } from "../src/infrastructure/persistence/in-memory-generation-repository.js";
import { generateAndPersistTicketQr } from "../src/application/generate-and-persist-ticket-qr.js";

const ticket = {
  id: "ticket-1",
  ticketNumber: "TKT-1001",
  holderName: "Sumit Joshi",
  eventName: "Tech Conference",
  quantity: 2,
  status: "active",
};

test("creates a generation record with stable identity and metadata", () => {
  const record = createGenerationRecord({
    ticketId: "ticket-1",
    ticketNumber: "TKT-1001",
    payloadHash: "a".repeat(64),
    createdAt: "2026-10-08T10:00:00.000Z",
  });
  assert.equal(record.id, `gen_${"a".repeat(24)}`);
  assert.equal(record.ticketId, "ticket-1");
  assert.equal(record.format, "svg");
  assert.equal(record.status, "generated");
  assert.equal(record.createdAt, "2026-10-08T10:00:00.000Z");
});

test("persists a newly generated QR record", async () => {
  const repository = new InMemoryGenerationRepository();
  const result = await generateAndPersistTicketQr(ticket, repository, "2026-10-08T10:00:00.000Z");
  assert.equal(result.reused, false);
  assert.equal(result.record.ticketNumber, "TKT-1001");
  assert.equal(result.record.payloadHash, result.generated.payloadHash);
  assert.equal(await repository.count(), 1);
});

test("reuses an existing record for the same ticket payload", async () => {
  const repository = new InMemoryGenerationRepository();
  const first = await generateAndPersistTicketQr(ticket, repository, "2026-10-08T10:00:00.000Z");
  const second = await generateAndPersistTicketQr(ticket, repository, "2026-10-08T10:05:00.000Z");
  assert.equal(second.reused, true);
  assert.equal(second.record.id, first.record.id);
  assert.equal(await repository.count(), 1);
});

test("blocks a changed payload for an already generated ticket", async () => {
  const repository = new InMemoryGenerationRepository();
  await generateAndPersistTicketQr(ticket, repository, "2026-10-08T10:00:00.000Z");
  await assert.rejects(
    () => generateAndPersistTicketQr({ ...ticket, holderName: "Changed Holder" }, repository),
    error => error.code === "DUPLICATE_GENERATION",
  );
});

test("returns null for a missing record", async () => {
  const repository = new InMemoryGenerationRepository();
  assert.equal(await repository.findById("missing"), null);
});

test("wraps persistence failures as domain errors", async () => {
  const failingRepository = {
    findByTicketNumber: async () => null,
    create: async () => { throw new Error("database unavailable"); },
  };
  await assert.rejects(
    () => generateAndPersistTicketQr(ticket, failingRepository),
    error => error.code === "PERSISTENCE_FAILURE" && /persisted/i.test(error.message),
  );
});
