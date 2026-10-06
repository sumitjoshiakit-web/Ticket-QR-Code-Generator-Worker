# Accessibility & Security Requirements

## Accessibility Target

Target **100% Lighthouse Accessibility**.

## Keyboard

Every interactive control must:

- be reachable using keyboard navigation
- have a logical focus order
- expose a visible focus indicator
- have an appropriate native element where possible

Do not use clickable `div` elements when a button or link is appropriate.

## Forms

Every field needs:

- an associated label
- clear required/optional indication
- validation feedback
- an accessible relationship between the input and its error

For invalid input, use appropriate `aria-invalid` and `aria-describedby` relationships.

## Status Messaging

Loading and error states should be understandable to screen-reader users. Use semantic status/live-region patterns only where appropriate; avoid excessive announcements.

## Color and Contrast

Do not communicate validation state through color alone. Error/success states must include text or another non-color cue.

## Security

- no real API keys in source
- no secrets in environment files committed to Git
- no sensitive personal data in fixtures or examples
- no raw HTML injection
- server-side validation remains authoritative
- structured QR payloads must be explicitly defined
- database constraints protect data integrity

## Operational Safety

Destructive actions, if introduced later, must require clear confirmation and should not silently discard ticket or QR history.
