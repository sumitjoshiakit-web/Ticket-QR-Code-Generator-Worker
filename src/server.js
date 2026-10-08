import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { DomainError } from "./domain/errors.js";
import { sanitizeTicketInput } from "./application/ticket-worker.js";
import { generateAndPersistTicketQr } from "./application/generate-and-persist-ticket-qr.js";
import { generateQrSvg } from "./infrastructure/qr/qrcode-generator.js";
import { FileGenerationRepository } from "./infrastructure/persistence/file-generation-repository.js";

const PORT = Number(process.env.PORT || 3000);
const repository = new FileGenerationRepository(process.env.DATA_FILE || "./data/generations.json");
const files = {
  "/": new URL("../public/index.html", import.meta.url),
  "/styles.css": new URL("../public/styles.css", import.meta.url),
  "/app.js": new URL("../public/app.js", import.meta.url)
};
const types = { "/": "text/html; charset=utf-8", "/styles.css": "text/css; charset=utf-8", "/app.js": "text/javascript; charset=utf-8" };

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'none'; form-action 'self'"
  });
  res.end(type.startsWith("application/json") ? JSON.stringify(body) : body);
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function handle(req, res) {
  if (req.method === "GET" && files[req.url]) {
    return send(res, 200, await readFile(files[req.url], "utf8"), types[req.url]);
  }
  if (req.method === "GET" && req.url === "/api/health") {
    return send(res, 200, { ok: true, service: "ticket-qr-code-generator-worker", version: "1.0.0" });
  }
  const generationMatch = req.url?.match(/^\/api\/generations\/([^/]+)$/);
  if (req.method === "GET" && generationMatch) {
    const record = await repository.findById(generationMatch[1]);
    return record
      ? send(res, 200, { data: record })
      : send(res, 404, { error: { code: "GENERATION_NOT_FOUND", message: "No data found." } });
  }
  if (req.method === "POST" && req.url === "/api/tickets/qr") {
    try {
      const input = sanitizeTicketInput(await parseBody(req));
      if (!input.id) input.id = "ticket_" + randomUUID();
      const result = await generateAndPersistTicketQr(input, repository);
      const qrSvg = await generateQrSvg(result.generated.payload);
      console.log("[Analytics] User interacted with Ticket QR Code Generator Worker");
      return send(res, 201, { data: {
        generationId: result.record.id, ticket: input, payloadVersion: result.generated.payloadVersion,
        payloadHash: result.generated.payloadHash, generatedAt: result.generated.generatedAt, reused: result.reused, qrSvg
      }});
    } catch (error) {
      if (error instanceof SyntaxError) return send(res, 400, { error: { code: "INVALID_JSON", message: "Request body must contain valid JSON." } });
      if (error instanceof DomainError) {
        const status = error.code === "PERSISTENCE_FAILURE" ? 503 : 400;
        return send(res, status, { error: { code: error.code, message: error.message, fields: error.fields } });
      }
      console.error(error);
      return send(res, 500, { error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." } });
    }
  }
  return send(res, 404, { error: { code: "NOT_FOUND", message: "No data found." } });
}

createServer((req, res) => handle(req, res).catch(error => {
  console.error(error);
  send(res, 500, { error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." } });
})).listen(PORT, () => console.log("Ticket QR Worker listening on port " + PORT));
