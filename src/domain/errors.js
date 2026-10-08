export class DomainError extends Error {
  constructor(code, message, fields = {}) { super(message); this.name = "DomainError"; this.code = code; this.fields = fields; }
}
export const ERROR_CODES = Object.freeze({ INVALID_INPUT: "INVALID_INPUT", INVALID_TICKET_STATUS: "INVALID_TICKET_STATUS" });
