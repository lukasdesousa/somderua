import assert from "node:assert/strict";
import test from "node:test";
import { getPackDownloadUrl } from "../lib/pack-downloads.ts";

test("seleciona o arquivo MediaFire correspondente à oferta aprovada", () => {
  assert.equal(
    getPackDownloadUrl("essencial"),
    "https://www.mediafire.com/file_premium/cm5fbfv3z9dfnpy/16gb-somderua-2026.zip/file",
  );
  assert.equal(
    getPackDownloadUrl("completo"),
    "https://www.mediafire.com/file_premium/21bz4vvd25zm6ca/27gb-atualizacao2026-.zip/file",
  );
});

test("mantém pedidos legados no Premium e rejeita ofertas desconhecidas", () => {
  assert.equal(
    getPackDownloadUrl(null),
    "https://www.mediafire.com/file_premium/21bz4vvd25zm6ca/27gb-atualizacao2026-.zip/file",
  );
  assert.equal(getPackDownloadUrl("outra-oferta"), null);
});
