import { generateAndPersistTicketQr } from "./generate-and-persist-ticket-qr.js";
import { sanitizeText } from "../domain/sanitize.js";

export function sanitizeTicketInput(input) {
  return {
    id: typeof input?.id === "string" ? sanitizeText(input.id, 80) : undefined,
    ticketNumber: sanitizeText(input?.ticketNumber, 64),
    holderName: sanitizeText(input?.holderName, 160),
    eventName: sanitizeText(input?.eventName, 200),
    quantity: input?.quantity,
    status: sanitizeText(input?.status, 24).toLowerCase()
  };
}

export async function generateTicket(input, repository, qrGenerator, now = new Date()) {
  const safeInput = sanitizeTicketInput(input);
  const result = await generateAndPersistTicketQr(safeInput, repository, now);
  const qrSvg = await qrGenerator(result.generated.payload);
  return Object.freeze({ ...result, qrSvg, analyticsMessage: "[Analytics] User interacted with Ticket QR Code Generator Worker" });
}
