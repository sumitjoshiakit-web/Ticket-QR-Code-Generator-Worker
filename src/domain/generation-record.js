import { DomainError, ERROR_CODES } from "./errors.js";

export const GENERATION_STATUS = "generated";
export const GENERATION_FORMAT = "svg";

export function createGenerationRecord({ ticketId, ticketNumber, payloadHash, format = GENERATION_FORMAT, status = GENERATION_STATUS, createdAt = new Date(), metadata = {} }) {
  if (!ticketNumber || typeof ticketNumber !== "string") {
    throw new DomainError(ERROR_CODES.INVALID_INPUT, "Generation record requires a ticket number.");
  }
  if (!payloadHash || !/^[a-f0-9]{64}$/.test(payloadHash)) {
    throw new DomainError(ERROR_CODES.INVALID_INPUT, "Generation record requires a valid SHA-256 payload hash.");
  }
  const timestamp = new Date(createdAt);
  if (Number.isNaN(timestamp.getTime())) {
    throw new DomainError(ERROR_CODES.INVALID_INPUT, "Generation record time is invalid.");
  }
  if (format !== GENERATION_FORMAT || status !== GENERATION_STATUS) {
    throw new DomainError(ERROR_CODES.INVALID_INPUT, "Generation record format or status is invalid.");
  }

  return Object.freeze({
    id: `gen_${payloadHash.slice(0, 24)}`,
    ticketId: typeof ticketId === "string" && ticketId.trim() ? ticketId.trim() : undefined,
    ticketNumber: ticketNumber.trim(),
    payloadHash,
    format,
    status,
    createdAt: timestamp.toISOString(),
    metadata: Object.freeze({ ...metadata }),
  });
}
