import { DomainError, ERROR_CODES } from "./errors.js";
const LIMITS = Object.freeze({ ticketNumber: 64, holderName: 160, eventName: 200 });
const VALID_STATUSES = new Set(["active", "used", "cancelled"]);
const text = value => typeof value === "string" ? value.trim() : "";
export function normalizeTicket(input) {
  if (!input || typeof input !== "object") throw new DomainError(ERROR_CODES.INVALID_INPUT, "Ticket data is required.");
  return { id: typeof input.id === "string" ? input.id.trim() : undefined, ticketNumber: text(input.ticketNumber).toUpperCase(), holderName: text(input.holderName), eventName: text(input.eventName), quantity: input.quantity, status: text(input.status).toLowerCase() };
}
export function validateTicket(input) {
  const ticket = normalizeTicket(input), fields = {};
  if (!ticket.ticketNumber) fields.ticketNumber = "Ticket number is required."; else if (ticket.ticketNumber.length > LIMITS.ticketNumber) fields.ticketNumber = "Ticket number is too long.";
  if (!ticket.holderName) fields.holderName = "Holder name is required."; else if (ticket.holderName.length > LIMITS.holderName) fields.holderName = "Holder name is too long.";
  if (!ticket.eventName) fields.eventName = "Event name is required."; else if (ticket.eventName.length > LIMITS.eventName) fields.eventName = "Event name is too long.";
  if (!Number.isInteger(ticket.quantity) || ticket.quantity <= 0) fields.quantity = "Quantity must be a positive integer.";
  if (!VALID_STATUSES.has(ticket.status)) fields.status = "Status must be active, used, or cancelled.";
  if (Object.keys(fields).length) throw new DomainError(ERROR_CODES.INVALID_INPUT, "The submitted ticket data is invalid.", fields);
  return Object.freeze(ticket);
}
export { LIMITS, VALID_STATUSES };
