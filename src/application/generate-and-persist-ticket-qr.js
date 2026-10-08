import { generateTicketQr } from "./generate-ticket-qr.js";
import { createGenerationRecord } from "../domain/generation-record.js";
import { DomainError, ERROR_CODES } from "../domain/errors.js";

export async function generateAndPersistTicketQr(input, repository, now = new Date()) {
  if (!repository || typeof repository.findByTicketNumber !== "function" || typeof repository.create !== "function") {
    throw new TypeError("A generation repository is required.");
  }

  const generated = generateTicketQr(input, now);
  const existing = await repository.findByTicketNumber(generated.ticketNumber);

  if (existing) {
    if (existing.payloadHash === generated.payloadHash) {
      return Object.freeze({ generated, record: existing, reused: true });
    }
    throw new DomainError(
      ERROR_CODES.DUPLICATE_GENERATION,
      "A different QR payload already exists for this ticket.",
      { ticketNumber: generated.ticketNumber },
    );
  }

  const record = createGenerationRecord({
    ticketId: input?.id,
    ticketNumber: generated.ticketNumber,
    payloadHash: generated.payloadHash,
    createdAt: generated.generatedAt,
  });

  try {
    const persisted = await repository.create(record);
    return Object.freeze({ generated, record: persisted, reused: false });
  } catch (error) {
    throw new DomainError(
      ERROR_CODES.PERSISTENCE_FAILURE,
      "The QR was generated but its generation record could not be persisted.",
      { cause: error instanceof Error ? error.message : String(error) },
    );
  }
}
