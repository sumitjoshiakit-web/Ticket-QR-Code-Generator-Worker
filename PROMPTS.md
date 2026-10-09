# PROMPTS.md — AI-Assisted Build Log

> A staged prompt log for the Ticket QR Code Generator Worker. The prompts below summarize the implementation instructions by development phase; they are organized for readability rather than presented as a verbatim chat transcript.

## Build Objective

Build a lightweight, production-minded Ticket QR Code Generator Worker that helps staff turn ticket details into a downloadable QR code. Prioritize a clear user journey, predictable validation, accessible feedback, safe text handling, and a deployable Node.js service.

---

## Prompt 01 — Understand the Requirements Before Coding

**Prompt**

> Read the project requirements and convert them into an implementation plan. Identify the user problem, primary workflow, functional requirements, edge cases, non-functional requirements, and definition of done. Keep the interface focused on staff completing one task quickly. Do not start feature implementation until the architecture and contracts are clear.

**Expected output**
- Requirement breakdown and acceptance criteria
- Clear happy path and failure paths
- Security, accessibility, performance, and deployment considerations

## Prompt 02 — Define the Architecture and Data Model

**Prompt**

> Design a small, maintainable architecture for the Ticket QR Code Generator Worker. Separate request handling, application logic, domain validation/sanitization, and persistence concerns. Draft the data model and ERD, document entity relationships, and describe how generated records could be persisted. Keep the architecture proportional to an MVP; avoid unnecessary frameworks and abstractions.

**Expected output**
- Architecture documentation
- Database schema and ERD
- Clear boundaries between application and infrastructure layers

## Prompt 03 — Specify the API Contract First

**Prompt**

> Define the API contract before implementing the UI. Document each endpoint's method, route, request fields, successful response shape, validation rules, status codes, and error response format. Include health-check behavior and consistent JSON responses. Make the contract simple enough for a small frontend to consume reliably.

**Expected output**
- API contract documentation
- Request/response examples
- Explicit invalid-input and server-error behavior

## Prompt 04 — Turn Acceptance Criteria into Tests

**Prompt**

> Convert the acceptance criteria into automated tests before expanding implementation. Cover valid input, missing or invalid fields, sanitization of untrusted text, API response structure, and failure behavior. Use the test runner supported by the current Node.js project, keep tests deterministic, and make failures explain what contract was broken.

**Expected output**
- Automated tests for core behavior
- Regression coverage for unhappy paths
- A test command that can run in CI

## Prompt 05 — Implement Safe Domain Utilities

**Prompt**

> Implement a small domain-level sanitization and validation utility for user-supplied ticket text. Normalize and validate values at the boundary, prevent untrusted input from being interpreted as markup, and keep the logic independently testable. Do not rely on frontend validation as the only security layer.

**Expected output**
- Reusable sanitization/validation logic
- Tests for normal, empty, malformed, and potentially unsafe input

## Prompt 06 — Build the Application Service

**Prompt**

> Implement the ticket-worker application service around the documented contract. Keep orchestration separate from HTTP concerns, generate QR output from validated ticket data, return a predictable result, and handle invalid input without crashing the process. Keep persistence behind a repository boundary so the storage strategy can evolve.

**Expected output**
- Focused application/service layer
- QR-generation flow
- Consistent validation and error handling

## Prompt 07 — Add the HTTP Server and API

**Prompt**

> Wire the application service into a small Node.js HTTP server. Implement the documented API routes, JSON parsing, safe error responses, and a health endpoint for deployment checks. Ensure the server binds to the host and port provided by the deployment platform, and avoid exposing secrets or internal stack traces in responses.

**Expected output**
- Runnable server
- API endpoints aligned with the documented contract
- Health check for hosting-platform verification

## Prompt 08 — Design a Clean, Responsive Worker UI

**Prompt**

> Build a professional, monochromatic interface for staff who need to generate a ticket QR code quickly. Use a clear heading, concise helper text, well-labelled fields, a primary action, and an obvious result area. Follow a consistent 16px/32px spacing rhythm, keep contrast readable, and make the layout usable on mobile and desktop. Avoid decorative UI that competes with the task.

**Expected output**
- Responsive HTML/CSS interface
- Accessible labels and focus states
- Clear visual hierarchy and restrained styling

## Prompt 09 — Connect the Frontend to the API

**Prompt**

> Connect the form to the API contract without duplicating business logic in the browser. Validate required fields before submission, show field-level errors, disable the primary action while a request is pending, and display success or failure feedback. Render the returned QR code and provide a working download action. Keep the UI state explicit so users always know what is happening.

**Expected output**
- End-to-end form submission
- QR result and download behavior
- Loading, success, and error states

## Prompt 10 — Handle Slow Networks and Empty States

**Prompt**

> Review the experience under slow-network conditions. Show a visible loading message while the request is pending, prevent duplicate submissions, and restore the action when the request finishes. Provide a useful empty state before any result exists and actionable error feedback when the request fails. Do not leave the user staring at an unresponsive button.

**Expected output**
- Loading state suitable for slow 3G
- Empty, success, and failure states
- Reliable button-state recovery

## Prompt 11 — Add Lightweight Interaction Telemetry

**Prompt**

> Add the required lightweight interaction telemetry when the primary action completes. Emit the specified analytics message to the browser console without collecting unnecessary personal data or adding a third-party tracking dependency. Keep telemetry separate from the core generation logic.

**Expected output**
- Required console analytics event
- No unnecessary tracking service or sensitive payloads

## Prompt 12 — Add Repository-Level Quality Gates

**Prompt**

> Add repeatable project scripts for starting the service, running automated tests, and linting the codebase. Configure ESLint consistently with the project's JavaScript module/runtime setup. Add a GitHub Actions workflow that runs tests and lint on pushes and pull requests. Keep the checks deterministic and fix warnings rather than suppressing them.

**Expected output**
- Start, test, and lint scripts
- ESLint configuration
- GitHub Actions CI workflow

## Prompt 13 — Prepare Deployment Configuration

**Prompt**

> Prepare the Node.js service for deployment on a managed hosting platform. Provide a minimal deployment configuration, respect the platform's runtime port, expose a health endpoint, and document required settings. Do not commit credentials. Review persistence assumptions carefully and document any limitations of local or ephemeral filesystem storage.

**Expected output**
- Deployment configuration
- Health-check instructions
- Honest documentation of environment and storage assumptions

## Prompt 14 — Document Setup and Developer Workflow

**Prompt**

> Write a practical README for a developer evaluating the repository. Explain what the worker does, the stack, project structure, local setup, available scripts, API usage, test/lint commands, deployment, and known limitations. Link to the architecture and API documents. Keep every claim consistent with the implementation—do not describe planned database integration as if it were already connected.

**Expected output**
- Setup and usage guide
- Links to design documents
- Explicit MVP scope and limitations

## Prompt 15 — Verify the Complete User Journey

**Prompt**

> Run a final acceptance review against the requirements. Check the valid submission path, required-field errors, QR rendering and download, loading behavior, mobile layout, health endpoint, automated tests, lint results, and CI workflow. Fix issues at their source, then repeat the relevant checks. Report only verified results and list anything that remains incomplete.

**Expected output**
- Requirement-to-test review
- Corrected edge cases
- Clear final verification status

---

## Implementation Notes

- The prompts are grouped by engineering phase; their wording is normalized for this document and is not intended to be an exact transcript.
- Automated tests use the Node.js built-in test runner in the current implementation.
- The schema/ERD document the intended data model, while the current MVP uses local file-based persistence rather than a live MongoDB connection.
- Hosting on an ephemeral filesystem may not preserve generated records across restarts or redeployments; use durable managed storage before relying on persistent production records.
- Keep this log aligned with the repository. Update it when behavior, architecture, or deployment changes.
