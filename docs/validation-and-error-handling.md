# Validation, Error Handling & Security

## Client Validation

The primary action must be blocked when required data is missing or malformed.

### Ticket Number

- required
- trimmed
- bounded length
- restricted to the supported ticket-number format

### Holder Name

- required
- trimmed
- bounded length
- treated as plain text

### Event Name

- required
- trimmed
- bounded length
- treated as plain text

### Quantity

- required
- integer
- greater than zero

## Field Error Behavior

Invalid fields must:

- receive a visible error state
- have an associated human-readable message
- remain keyboard accessible
- expose the error to assistive technology
- prevent submission until corrected

## Empty State

When a lookup or list contains no records, render:

**No data found.**

Never leave the primary content region blank.

## Loading State

During asynchronous work:

- show a visible progress/loading indicator
- keep the relevant action understandable
- prevent accidental duplicate submission where appropriate
- do not replace the entire application with an unexplained spinner

## Network Errors

For slow or failed connectivity:

1. show loading while the request is pending
2. catch the failure
3. show a recoverable error message
4. keep previously valid UI state where possible
5. provide a retry path when retrying is safe

## XSS Safety

All user-controlled strings are untrusted.

The application must:

- sanitize text before storing it in application state according to the chosen implementation
- render user text as text, never executable HTML
- avoid `dangerouslySetInnerHTML`
- validate again on the server/API boundary
- never interpolate user text into executable JavaScript or unsafe URLs

## Telemetry Simulation

After a primary action completes successfully, write exactly:

`[Analytics] User interacted with Ticket QR Code Generator Worker`

No third-party analytics SDK is required for this simulation.
