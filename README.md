# Ticket QR Code Generator Worker

A digital operational worker that replaces paper/Excel ticket handling with a reliable, accessible QR-generation workflow.

## Delivery status

**Architecture first → working MVP**

The project follows the required sequence: database schema, ERD, API contracts, security/accessibility rules, and architecture were defined first. The implementation was then built against those contracts.

## Implemented

- Accessible responsive worker interface.
- Client and server validation with visible field errors.
- XSS-oriented text sanitization before application state/persistence.
- Loading state for asynchronous generation.
- Recoverable network/server error state.
- Explicit **No data found** empty state.
- Deterministic structured QR payload with SHA-256 hash.
- QR SVG generation.
- Persistence abstraction with a local file adapter for the MVP.
- Idempotent duplicate generation handling.
- Required simulated analytics telemetry.
- Security headers and no committed secrets.
- Automated Node tests and ESLint configuration.
- GitHub Actions CI for tests and lint.

## Architecture-first documents

- [Architecture](docs/architecture.md)
- [Database Schema](docs/database-schema.md)
- [ERD](docs/erd.md)
- [API Contracts](docs/api-contracts.md)
- [Validation, Errors & Security](docs/validation-and-error-handling.md)
- [Accessibility & Security](docs/accessibility-and-security.md)
- [AI Prompt Traceability](PROMPTS.md)

## Run locally

Requires Node.js 20+.

```bash
npm install
npm test
npm run lint
npm start
```

Open `http://localhost:3000`.

The default persistence file is `data/generations.json`. Set `DATA_FILE` for another location.

## API

### Health
`GET /api/health`

### Generate QR
`POST /api/tickets/qr`

Example:
```json
{
  "ticketNumber": "TKT-000123",
  "holderName": "Example Holder",
  "eventName": "Example Event",
  "quantity": 2,
  "status": "active"
}
```

### Get generation
`GET /api/generations/:id`

## Production persistence

The application uses a repository abstraction. The architecture documents the MongoDB schema; the current MVP uses a local file adapter so it can run without credentials. A production deployment can swap this adapter for the documented MongoDB implementation without changing the domain contract.

## AI traceability

`PROMPTS.md` records the actual AI-assisted workflow. It does not claim Antigravity usage that did not occur.
