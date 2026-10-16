import { MAX_LOGO_BYTES } from "../shared/company-branding";

export class LogoInputError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

function imageDimensions(mime: string, bytes: Buffer): [number, number] | undefined {
  if (mime === "image/png") {
    if (bytes.length < 45
      || !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      || bytes.readUInt32BE(8) !== 13
      || bytes.toString("ascii", 12, 16) !== "IHDR"
      || bytes.toString("ascii", bytes.length - 8, bytes.length - 4) !== "IEND") return;
    return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
  }

  if (mime === "image/jpeg") {
    if (bytes.length < 10 || bytes[0] !== 0xff || bytes[1] !== 0xd8
      || bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) return;
    let offset = 2;
    while (offset + 4 <= bytes.length) {
      if (bytes[offset++] !== 0xff) return;
      while (bytes[offset] === 0xff) offset++;
      const marker = bytes[offset++];
      if (marker === 0xda || marker === 0xd9) return;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (offset + 2 > bytes.length) return;
      const length = bytes.readUInt16BE(offset);
      if (length < 2 || offset + length > bytes.length) return;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        if (length < 8) return;
        return [bytes.readUInt16BE(offset + 5), bytes.readUInt16BE(offset + 3)];
      }
      offset += length;
    }
    return;
  }

  if (mime === "image/webp") {
    if (bytes.length < 30 || bytes.toString("ascii", 0, 4) !== "RIFF"
      || bytes.toString("ascii", 8, 12) !== "WEBP"
      || bytes.readUInt32LE(4) !== bytes.length - 8) return;
    const chunk = bytes.toString("ascii", 12, 16);
    if (chunk === "VP8X") return [bytes.readUIntLE(24, 3) + 1, bytes.readUIntLE(27, 3) + 1];
    if (chunk === "VP8 " && bytes.subarray(23, 26).equals(Buffer.from([157, 1, 42]))) {
      return [bytes.readUInt16LE(26) & 0x3fff, bytes.readUInt16LE(28) & 0x3fff];
    }
    if (chunk === "VP8L" && bytes[20] === 0x2f) {
      const bits = bytes.readUInt32LE(21);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
  }
}

export function parseLogoDataUrl(dataUrl: unknown): { mime: string; bytes: Buffer } {
  if (typeof dataUrl !== "string") throw new LogoInputError("업로드할 이미지를 선택해 주세요.");
  if (dataUrl.length > Math.ceil(MAX_LOGO_BYTES / 3) * 4 + 40) {
    throw new LogoInputError("512KB 이하의 이미지를 선택해 주세요.", 413);
  }
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(dataUrl);
  if (!match) throw new LogoInputError("PNG, JPG, WEBP 이미지만 업로드할 수 있습니다.");
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.toString("base64") !== match[2]) {
    throw new LogoInputError("올바른 이미지 파일이 아닙니다.");
  }
  if (bytes.length > MAX_LOGO_BYTES) throw new LogoInputError("512KB 이하의 이미지를 선택해 주세요.", 413);
  const dimensions = imageDimensions(match[1], bytes);
  if (!dimensions || dimensions.some(value => value < 1 || value > 4096)) {
    throw new LogoInputError("올바른 이미지 파일을 선택해 주세요. 가로·세로는 4096px 이하여야 합니다.");
  }
  return { mime: match[1], bytes };
}
