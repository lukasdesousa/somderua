import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeGoogleDriveUrl,
  parseDownloadProvider,
} from "../lib/downloads.ts";

test("aceita apenas provedores de download conhecidos e mantém o direto como padrão", () => {
  assert.equal(parseDownloadProvider(null), "direct");
  assert.equal(parseDownloadProvider("direct"), "direct");
  assert.equal(parseDownloadProvider("google_drive"), "google_drive");
  assert.equal(parseDownloadProvider("outro"), null);
});

test("aceita somente links HTTPS oficiais do Google Drive", () => {
  assert.equal(
    normalizeGoogleDriveUrl(
      " https://drive.google.com/file/d/arquivo/view?usp=sharing ",
    ),
    "https://drive.google.com/file/d/arquivo/view?usp=sharing",
  );
  assert.equal(
    normalizeGoogleDriveUrl("https://docs.google.com/uc?id=arquivo"),
    "https://docs.google.com/uc?id=arquivo",
  );
  assert.equal(
    normalizeGoogleDriveUrl("http://drive.google.com/file/d/arquivo"),
    null,
  );
  assert.equal(
    normalizeGoogleDriveUrl("https://drive.google.com.exemplo.com/arquivo"),
    null,
  );
  assert.equal(normalizeGoogleDriveUrl(""), null);
});
