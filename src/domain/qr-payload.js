import { createHash } from "node:crypto";
export const QR_PAYLOAD_VERSION = "v1";
export function buildQrPayload(ticket) { return Object.freeze({ v: QR_PAYLOAD_VERSION, ticketNumber: ticket.ticketNumber, holderName: ticket.holderName, eventName: ticket.eventName, quantity: ticket.quantity, status: ticket.status }); }
export function serializeQrPayload(payload) { return JSON.stringify(payload); }
export function hashQrPayload(payload) { return createHash("sha256").update(serializeQrPayload(payload), "utf8").digest("hex"); }
