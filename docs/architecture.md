# Architecture

## 1. Product Boundary

The Ticket QR Code Generator Worker is a focused operational application for floor staff and managers.

Primary flow:

1. Staff opens the worker.
2. Staff enters or selects ticket information.
3. Client validates required and formatted fields.
4. The system sanitizes user-controlled text before storing it in application state.
5. A QR-generation request is prepared.
6. Async processing displays a visible loading state.
7. Success displays the generated QR and structured ticket summary.
8. The completed primary action logs:
   `[Analytics] User interacted with Ticket QR Code Generator Worker`
9. Errors are shown near the affected operation without blank screens.

## 2. Logical Layers

### Presentation Layer

Responsible for:

- semantic UI
- form controls
- validation messages
- loading/empty/error/success states
- keyboard interaction
- QR result presentation

### Application Layer

Responsible for:

- input normalization
- validation orchestration
- request state
- QR payload construction
- telemetry simulation
- error mapping

### Data Layer

Responsible for:

- ticket persistence
- QR generation records
- consistent identifiers
- timestamps/statuses
- indexes and relational integrity

### API Boundary

The API contract is documented independently of the eventual framework so frontend and backend implementations can evolve without changing the domain model.

## 3. Reliability Strategy

The application must assume slow or unreliable connectivity.

- Async operations always expose a loading state.
- Network failures become user-readable errors.
- The UI must remain usable when a request fails.
- Empty responses are represented explicitly.
- No operation should depend on an unhandled promise rejection.
- Client-side validation prevents avoidable requests.

## 4. Security Boundary

User-controlled text is treated as untrusted input.

- Do not render raw HTML from user input.
- Avoid `dangerouslySetInnerHTML`.
- Normalize and sanitize text before storing it in state.
- Validate again at the API boundary.
- Never place API secrets in client code.
- QR payloads must contain only intended structured fields.

## 5. Design System

The UI should use a clean monochromatic corporate visual language.

Rules:

- centralized design tokens
- no rogue hex colors in component styles
- spacing based on 16px / 32px steps
- restrained border radius
- clear typography hierarchy
- visible keyboard focus
- no unnecessary gradients, glow, glassmorphism, or decorative dashboard noise
