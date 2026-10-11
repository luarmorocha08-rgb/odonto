import assert from "node:assert/strict";
import { test } from "node:test";
import { services } from "../src/content/services.ts";
import { isUnsafeSvg, kindFromName, safeFileName, sniffKind } from "../src/lib/files.ts";
import { searchSite } from "../src/lib/search.ts";
import { aspectRatio, calculateDimensions, convert } from "../src/lib/units.ts";

test("calcula área, total e conversões", () => {
  const r = calculateDimensions(100, 50, "cm", 3)!;
  assert.equal(r.areaM2, 0.5);
  assert.equal(r.totalAreaM2, 1.5);
  assert.equal(r.ratio, "2:1");
  assert.equal(r.orientation, "horizontal");
  assert.equal(r.conversions.mm.width, 1000);
  assert.equal(convert(1.2, "m", "cm"), 120);
  assert.equal(calculateDimensions(0, 10, "cm", 1), null);
  assert.equal(aspectRatio(21, 29.7), "0,71:1");
  assert.equal(aspectRatio(1920, 1080), "16:9");
});

test("identifica arquivos pela assinatura real", () => {
  assert.equal(sniffKind(new TextEncoder().encode("%PDF-1.7")), "pdf");
  assert.equal(sniffKind(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d])), "png");
  assert.equal(sniffKind(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), "jpg");
  assert.equal(sniffKind(new TextEncoder().encode('<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg">')), "svg");
  assert.equal(sniffKind(new TextEncoder().encode("not a file")), null);
  assert.equal(kindFromName("Arte Final.JPEG"), "jpg");
  assert.equal(kindFromName("arte.exe"), null);
  assert.equal(safeFileName("Minha Árte (final).pdf"), "Minha-Arte-final.pdf");
});

test("recusa SVG com script ou links externos", () => {
  assert.equal(isUnsafeSvg('<svg><script>alert(1)</script></svg>'), true);
  assert.equal(isUnsafeSvg('<svg><rect onload="x()"/></svg>'), true);
  assert.equal(isUnsafeSvg('<svg><a href="https://evil.test"/></svg>'), true);
  assert.equal(isUnsafeSvg('<svg><use href="#a"/><rect fill="#fff"/></svg>'), false);
});

test("busca inteligente sugere serviços pelo uso", () => {
  const top = searchSite("placa para loja", services).map((r) => r.title);
  assert.ok(top.slice(0, 3).includes("Fachadas comerciais"));
  assert.ok(top.includes("Sinalização"));
  assert.equal(searchSite("adesivo para carro", services)[0].title, "Adesivos personalizados");
  assert.equal(searchSite("cartao de visita", services)[0].title, "Impressos personalizados");
  assert.deepEqual(searchSite("   ", services), []);
});
