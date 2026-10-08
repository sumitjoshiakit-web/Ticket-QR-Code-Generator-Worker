/* eslint-disable no-control-regex */
const TAGS = /<[^>]*>/g;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeText(value, maxLength = 200) {
  if (typeof value !== "string") return "";
  return value.replace(TAGS, "").replace(CONTROL_CHARS, "")
    .replace(/javascript\s*:/gi, "").replace(/on[a-z]+\s*=\s*/gi, "")
    .trim().slice(0, maxLength);
}
