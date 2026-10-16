import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MAX_LOGO_BYTES } from "../shared/company-branding";
import { LogoInputError, parseLogoDataUrl } from "./company-logo-input";

const png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=";
const webp = "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";

test("accepts a transparent PNG without modifying its bytes", () => {
  const parsed = parseLogoDataUrl(`data:image/png;base64,${png}`);
  assert.equal(parsed.mime, "image/png");
  assert.equal(parsed.bytes.toString("base64"), png);
});

test("accepts JPEG and WEBP images", () => {
  const jpeg = readFileSync(new URL("../client/public/banner2.jpg", import.meta.url));
  assert.equal(parseLogoDataUrl(`data:image/jpeg;base64,${jpeg.toString("base64")}`).mime, "image/jpeg");
  assert.equal(parseLogoDataUrl(`data:image/webp;base64,${webp}`).mime, "image/webp");
});

test("rejects unsupported SVG and MIME spoofing", () => {
  assert.throws(() => parseLogoDataUrl("data:image/svg+xml;base64,PHN2Zy8+"), LogoInputError);
  assert.throws(() => parseLogoDataUrl(`data:image/jpeg;base64,${png}`), LogoInputError);
  assert.throws(() => parseLogoDataUrl("data:image/png;base64,PHN2Zy8+"), LogoInputError);
});

test("rejects missing, malformed, and non-canonical base64 data", () => {
  for (const input of [undefined, {}, "", "data:image/png;base64,!!!!", `data:image/png;base64,${png.slice(0, -1)}`]) {
    assert.throws(() => parseLogoDataUrl(input), LogoInputError);
  }
});

test("rejects oversized uploads with HTTP 413", () => {
  const data = `data:image/png;base64,${Buffer.alloc(MAX_LOGO_BYTES + 1).toString("base64")}`;
  assert.throws(() => parseLogoDataUrl(data), (error: unknown) => error instanceof LogoInputError && error.status === 413);
});

test("rejects image dimensions above 4096px and truncated PNGs", () => {
  const huge = Buffer.from(png, "base64");
  huge.writeUInt32BE(4097, 16);
  assert.throws(() => parseLogoDataUrl(`data:image/png;base64,${huge.toString("base64")}`), LogoInputError);
  const truncated = Buffer.from(png, "base64").subarray(0, 33);
  assert.throws(() => parseLogoDataUrl(`data:image/png;base64,${truncated.toString("base64")}`), LogoInputError);
});
