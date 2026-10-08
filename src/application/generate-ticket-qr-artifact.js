import { generateTicketQr } from "./generate-ticket-qr.js";
import { generateQrSvg } from "../infrastructure/qr/qrcode-generator.js";

export const QR_GENERATION_STATUS = "generated";

export async function generateTicketQrArtifact(input, now = new Date()) {
  const generation = generateTicketQr(input, now);
  const qrSvg = await generateQrSvg(generation.payload);

  return Object.freeze({
    ticketNumber: generation.ticketNumber,
    payloadVersion: generation.payloadVersion,
    payloadHash: generation.payloadHash,
    generatedAt: generation.generatedAt,
    status: QR_GENERATION_STATUS,
    format: "svg",
    qrSvg,
  });
}
