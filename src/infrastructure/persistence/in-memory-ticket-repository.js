import { randomUUID } from "node:crypto";
import { sanitizeText } from "../../domain/sanitize.js";

export class InMemoryTicketRepository {
  #tickets = new Map();

  async seed(ticket) {
    const record = {
      id: ticket.id ?? randomUUID(),
      ticketNumber: sanitizeText(ticket.ticketNumber).toUpperCase(),
      holderName: sanitizeText(ticket.holderName),
      eventName: sanitizeText(ticket.eventName),
      quantity: ticket.quantity,
      status: sanitizeText(ticket.status).toLowerCase(),
      createdAt: ticket.createdAt ?? new Date().toISOString(),
      updatedAt: ticket.updatedAt ?? new Date().toISOString(),
    };
    this.#tickets.set(record.ticketNumber, Object.freeze(record));
    return record;
  }

  async findByTicketNumber(ticketNumber) {
    return this.#tickets.get(sanitizeText(ticketNumber).toUpperCase()) ?? null;
  }

  async list() {
    return [...this.#tickets.values()];
  }
}
