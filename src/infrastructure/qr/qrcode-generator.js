import QRCode from "qrcode";

export const QR_OUTPUT_FORMAT = "svg";

export async function generateQrSvg(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new TypeError("QR payload must be a non-null object.");
  }

  const serializedPayload = JSON.stringify(payload);
  if (!serializedPayload) {
    throw new TypeError("QR payload could not be serialized.");
  }

  const svg = await QRCode.toString(serializedPayload, {
    type: QR_OUTPUT_FORMAT,
    errorCorrectionLevel: "M",
    margin: 1,
  });

  if (!svg.includes("<svg") || !svg.includes("</svg>")) {
    throw new Error("QR encoder returned an invalid SVG document.");
  }

  return svg;
}
