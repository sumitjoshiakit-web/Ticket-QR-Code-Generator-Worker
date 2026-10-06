# API Contracts

These contracts define the intended API boundary. They are implementation-neutral and can be mapped to REST routes during the application phase.

## GET /api/tickets/:ticketNumber

Retrieve one ticket by its human-facing ticket number.

### Success — 200

```json
{
  "data": {
    "id": "uuid",
    "ticketNumber": "TKT-000123",
    "holderName": "Example Holder",
    "eventName": "Example Event",
    "quantity": 2,
    "status": "active"
  }
}
```

### Empty / Not Found — 404

```json
{
  "error": {
    "code": "TICKET_NOT_FOUND",
    "message": "No data found."
  }
}
```

## POST /api/tickets/:ticketNumber/qr

Generate a QR representation for an existing valid ticket.

### Request

```json
{
  "payloadVersion": "v1"
}
```

### Success — 201

```json
{
  "data": {
    "qrGenerationId": "uuid",
    "ticketNumber": "TKT-000123",
    "payloadVersion": "v1",
    "payloadHash": "sha256",
    "generatedAt": "2026-10-06T00:00:00Z"
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

### Not Found — 404

```json
{
  "error": {
    "code": "TICKET_NOT_FOUND",
    "message": "No data found."
  }
}
```

### Connectivity / Server Failure — 503

```json
{
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "The service is temporarily unavailable. Please try again."
  }
}
```

## API Rules

- JSON request/response format.
- Never expose internal database errors to the user.
- Stable machine-readable error codes.
- Human-readable messages suitable for UI display.
- Server validates all input even when client validation already ran.
- No secrets or credentials in request payloads.
