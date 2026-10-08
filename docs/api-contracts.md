# API Contracts

The architecture-first API contract is now implemented by the Node runtime.

## GET /api/health

Health check used by deployment infrastructure.

### Success — 200

```json
{
  "ok": true,
  "service": "ticket-qr-code-generator-worker",
  "version": "1.0.0"
}
```

## POST /api/tickets/qr

Validate ticket input, generate a deterministic QR payload, persist a generation record, and return an SVG QR document.

### Request

```json
{
  "ticketNumber": "TKT-000123",
  "holderName": "Example Holder",
  "eventName": "Example Event",
  "quantity": 2,
  "status": "active"
}
```

### Success — 201

```json
{
  "data": {
    "generationId": "gen_...",
    "ticket": {
      "ticketNumber": "TKT-000123",
      "holderName": "Example Holder",
      "eventName": "Example Event",
      "quantity": 2,
      "status": "active"
    },
    "payloadVersion": "v1",
    "payloadHash": "sha256",
    "generatedAt": "2026-10-08T00:00:00Z",
    "reused": false,
    "qrSvg": "<svg>...</svg>"
  }
}
```

### Validation Failure — 400

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "The submitted ticket data is invalid.",
    "fields": {
      "ticketNumber": "Ticket number is required."
    }
  }
}
```

### Not Found / Empty — 404

Unknown routes and missing generation records return:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "No data found."
  }
}
```

### Service Failure — 503

Persistence failures are mapped to a recoverable service error:

```json
{
  "error": {
    "code": "PERSISTENCE_FAILURE",
    "message": "The QR was generated but its generation record could not be persisted."
  }
}
```

### Internal Failure — 500

Unexpected failures never expose internal database/runtime details:

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong. Please try again."
  }
}
```

## GET /api/generations/:id

Retrieve a previously persisted generation record.

### Success — 200

Returns the stored generation record under `data`.

### Missing record — 404

Returns the standard **No data found.** response.

## API rules

- JSON request/response format for API operations.
- Server-side validation is authoritative.
- User-controlled text is sanitized before persistence.
- Stable machine-readable error codes are returned.
- Human-readable messages are suitable for UI display.
- No secrets or credentials are accepted in request payloads.
