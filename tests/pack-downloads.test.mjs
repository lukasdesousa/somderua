import assert from "node:assert/strict";
import test from "node:test";
import { getPackDownloadObject } from "../lib/pack-downloads.ts";

test("seleciona o objeto R2 correspondente à oferta aprovada", () => {
  assert.deepEqual(
    getPackDownloadObject("essencial"),
    {
      key: "pack/16gb-somderua-2026.zip",
      filename: "16gb-somderua-2026.zip",
    },
  );
  assert.deepEqual(
    getPackDownloadObject("completo"),
    {
      key: "pack/27gb-atualizacao2026-.zip",
      filename: "27gb-atualizacao2026-.zip",
    },
  );
});

test("mantém pedidos legados no Premium e rejeita ofertas desconhecidas", () => {
  assert.deepEqual(
    getPackDownloadObject(null),
    {
      key: "pack/27gb-atualizacao2026-.zip",
      filename: "27gb-atualizacao2026-.zip",
    },
  );
  assert.equal(getPackDownloadObject("outra-oferta"), null);
});
