# Database Schema

## Design Principles

The schema is designed around a stable ticket record and its generated QR records.

- UUID primary keys for application entities
- human-readable ticket number with a unique constraint
- explicit lifecycle status
- immutable QR generation records
- UTC timestamps
- foreign-key integrity
- indexes on operational lookup fields

## Tables

### tickets

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| id | UUID | PK | Internal ticket identifier |
| ticket_number | VARCHAR(64) | UNIQUE, NOT NULL | Human-facing ticket reference |
| holder_name | VARCHAR(160) | NOT NULL | Ticket holder name |
| event_name | VARCHAR(200) | NOT NULL | Event/activity name |
| quantity | INTEGER | NOT NULL, CHECK > 0 | Number of ticket units |
| status | VARCHAR(24) | NOT NULL | active, used, cancelled |
| created_at | TIMESTAMPTZ | NOT NULL | Creation time |
| updated_at | TIMESTAMPTZ | NOT NULL | Last update time |

### qr_generations

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| id | UUID | PK | QR generation record |
| ticket_id | UUID | FK tickets.id, NOT NULL | Related ticket |
| payload_version | VARCHAR(16) | NOT NULL | QR payload schema version |
| payload_hash | CHAR(64) | NOT NULL | Integrity/deduplication hash |
| generated_at | TIMESTAMPTZ | NOT NULL | Generation timestamp |
| generated_by | VARCHAR(120) | NULL | Optional worker/user identifier |
| status | VARCHAR(24) | NOT NULL | generated, failed |
| error_code | VARCHAR(64) | NULL | Structured failure reason |

## Recommended Constraints

- `tickets.quantity > 0`
- `tickets.status IN ('active','used','cancelled')`
- `qr_generations.status IN ('generated','failed')`
- `qr_generations.ticket_id` references `tickets.id` with restricted deletion
- `payload_hash` is indexed for lookup/deduplication

## Indexes

- unique index on `tickets.ticket_number`
- index on `tickets.status`
- index on `tickets.created_at`
- index on `qr_generations.ticket_id`
- index on `qr_generations.payload_hash`
- index on `qr_generations.generated_at`

## Data Integrity

A QR generation cannot exist without a valid ticket. Ticket deletion should not silently delete operational QR history.
