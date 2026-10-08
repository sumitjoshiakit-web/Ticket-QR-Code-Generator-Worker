const CONTROL_CHARS = /[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]/g;

export function sanitizeText(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(CONTROL_CHARS, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript\\s*:/gi, "")
    .trim();
}
