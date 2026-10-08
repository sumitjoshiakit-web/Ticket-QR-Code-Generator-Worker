import { validateTicket } from "../domain/validation.js";
import { buildQrPayload, hashQrPayload, QR_PAYLOAD_VERSION } from "../domain/qr-payload.js";
import { DomainError, ERROR_CODES } from "../domain/errors.js";
export function generateTicketQr(input, now = new Date()) {
  const ticket = validateTicket(input);
  if (ticket.status !== "active") throw new DomainError(ERROR_CODES.INVALID_TICKET_STATUS, "Only active tickets can generate a QR code.", { status: "Ticket must be active to generate a QR code." });
  const payload = buildQrPayload(ticket), payloadHash = hashQrPayload(payload), generatedAt = new Date(now);
  if (Number.isNaN(generatedAt.getTime())) throw new DomainError(ERROR_CODES.INVALID_INPUT, "Generation time is invalid.");
  return Object.freeze({ ticketNumber: ticket.ticketNumber, payloadVersion: QR_PAYLOAD_VERSION, payload, payloadHash, generatedAt: generatedAt.toISOString() });
}
