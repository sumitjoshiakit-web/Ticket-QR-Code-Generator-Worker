# Entity Relationship Diagram

The initial domain has two core entities.

```mermaid
erDiagram
    TICKETS ||--o{ QR_GENERATIONS : "has"

    TICKETS {
        uuid id PK
        varchar ticket_number UK
        varchar holder_name
        varchar event_name
        int quantity
        varchar status
        timestamptz created_at
        timestamptz updated_at
    }

    QR_GENERATIONS {
        uuid id PK
        uuid ticket_id FK
        varchar payload_version
        char payload_hash
        timestamptz generated_at
        varchar generated_by
        varchar status
        varchar error_code
    }
```

## Relationship

One ticket can have zero or many QR generation records.

This keeps the current ticket state separate from the history of generation attempts and avoids overwriting operational history.
