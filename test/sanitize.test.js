import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeText } from "../src/domain/sanitize.js";
test("removes HTML and executable URL/handler patterns",()=>assert.equal(sanitizeText('<img src=x onerror=alert(1)>javascript:alert(1)'),"alert(1)"));
