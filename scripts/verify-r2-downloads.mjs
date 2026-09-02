import { readFileSync } from "node:fs";
import { GetObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const requiredEnvironmentVariables = [
  "R2_ENDPOINT",
  "R2_BUCKET",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
];

const packs = [
  {
    offer: "BASICO",
    key: "pack/16gb-somderua-2026.zip",
    minimumBytes: 13_000_000_000,
    minimumAudioFiles: 5_000,
  },
  {
    offer: "PREMIUM",
    key: "pack/27gb-atualizacao2026-.zip",
    minimumBytes: 26_000_000_000,
    minimumAudioFiles: 8_000,
  },
];

loadLocalEnvironment();
validateEnvironment();

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

let verificationFailed = false;

for (const pack of packs) {
  const result = await auditPack(pack);

  console.log(JSON.stringify(result));

  if (
    !result.sizeMatches
    || !result.quantityMatches
    || !result.safeExtensions
    || result.contentType !== "application/zip"
  ) {
    verificationFailed = true;
  }
}

if (verificationFailed) {
  process.exitCode = 1;
}

async function auditPack(pack) {
  const metadata = await client.send(new HeadObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: pack.key,
  }));
  const totalBytes = Number(metadata.ContentLength);

  if (!Number.isSafeInteger(totalBytes)) {
    throw new Error(`${pack.offer}: tamanho do objeto invalido`);
  }

  const filename = pack.key.split("/").at(-1);
  const signedUrl = await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: pack.key,
      ResponseContentDisposition: `attachment; filename="${filename}"`,
      ResponseContentType: "application/zip",
    }),
    { expiresIn: 300 },
  );
  const zip = await readZipDirectory(signedUrl, totalBytes);

  return {
    offer: pack.offer,
    object: pack.key,
    bytes: totalBytes,
    contentType: metadata.ContentType,
    zipEntries: zip.entryCount.toString(),
    files: zip.regularFiles,
    audioFiles: zip.audioFiles,
    mainExtensions: Object.fromEntries(zip.topExtensions),
    nonAudioFilenames: zip.nonAudioFilenames,
    suspiciousExecutableFiles: zip.suspiciousFiles,
    sizeMatches: totalBytes > pack.minimumBytes,
    quantityMatches: zip.audioFiles > pack.minimumAudioFiles,
    safeExtensions: zip.suspiciousFiles === 0,
  };
}

async function readZipDirectory(url, totalBytes) {
  const tailStart = Math.max(0, totalBytes - 131_072);
  const tail = await fetchRange(url, `bytes=${tailStart}-${totalBytes - 1}`);
  const eocdIndex = findSignatureReverse(tail, 0x06054b50);

  if (eocdIndex < 0) {
    throw new Error("Diretorio final do ZIP nao encontrado");
  }

  let entryCount = BigInt(tail.readUInt16LE(eocdIndex + 10));
  let directorySize = BigInt(tail.readUInt32LE(eocdIndex + 12));
  let directoryOffset = BigInt(tail.readUInt32LE(eocdIndex + 16));

  if (
    entryCount === 0xffffn
    || directorySize === 0xffffffffn
    || directoryOffset === 0xffffffffn
  ) {
    const locatorIndex = findSignatureReverse(tail, 0x07064b50, eocdIndex - 1);

    if (locatorIndex < 0) {
      throw new Error("Localizador ZIP64 nao encontrado");
    }

    const zip64Offset = tail.readBigUInt64LE(locatorIndex + 8);
    const zip64 = await fetchRange(url, `bytes=${zip64Offset}-${zip64Offset + 55n}`);

    if (zip64.readUInt32LE(0) !== 0x06064b50) {
      throw new Error("Registro ZIP64 invalido");
    }

    entryCount = zip64.readBigUInt64LE(32);
    directorySize = zip64.readBigUInt64LE(40);
    directoryOffset = zip64.readBigUInt64LE(48);
  }

  if (directorySize <= 0n || directorySize > 100_000_000n) {
    throw new Error(`Tamanho inesperado do diretorio central: ${directorySize}`);
  }

  const directoryEnd = directoryOffset + directorySize - 1n;
  const directory = await fetchRange(
    url,
    `bytes=${directoryOffset}-${directoryEnd}`,
  );
  const audioPattern = /\.(?:mp3|flac|wav|m4a|aac|ogg|wma)$/i;
  const suspiciousPattern = /\.(?:exe|msi|bat|cmd|com|scr|ps1|vbs|js|jar|lnk)$/i;
  const extensions = new Map();
  const nonAudioFilenames = new Set();
  let offset = 0;
  let parsedEntries = 0;
  let regularFiles = 0;
  let audioFiles = 0;
  let suspiciousFiles = 0;

  while (offset + 46 <= directory.length && parsedEntries < Number(entryCount)) {
    if (directory.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`Entrada central invalida no offset ${offset}`);
    }

    const nameLength = directory.readUInt16LE(offset + 28);
    const extraLength = directory.readUInt16LE(offset + 30);
    const commentLength = directory.readUInt16LE(offset + 32);
    const recordLength = 46 + nameLength + extraLength + commentLength;

    if (offset + recordLength > directory.length) {
      throw new Error("Entrada central truncada");
    }

    const name = directory
      .subarray(offset + 46, offset + 46 + nameLength)
      .toString("utf8");
    const isDirectory = name.endsWith("/") || name.endsWith("\\");

    if (!isDirectory) {
      regularFiles += 1;

      if (audioPattern.test(name)) {
        audioFiles += 1;
      } else {
        nonAudioFilenames.add(name.split(/[\\/]/).at(-1));
      }
      if (suspiciousPattern.test(name)) suspiciousFiles += 1;

      const extensionMatch = name.match(/\.([a-z0-9]{1,8})$/i);
      const extension = extensionMatch
        ? extensionMatch[1].toLowerCase()
        : "sem_extensao";

      extensions.set(extension, (extensions.get(extension) ?? 0) + 1);
    }

    parsedEntries += 1;
    offset += recordLength;
  }

  if (BigInt(parsedEntries) !== entryCount) {
    throw new Error(
      `Contagem do ZIP diverge: esperado ${entryCount}, lido ${parsedEntries}`,
    );
  }

  return {
    entryCount,
    regularFiles,
    audioFiles,
    suspiciousFiles,
    nonAudioFilenames: [...nonAudioFilenames].sort(),
    topExtensions: [...extensions.entries()]
      .sort((first, second) => second[1] - first[1])
      .slice(0, 6),
  };
}

async function fetchRange(url, range) {
  const response = await fetch(url, {
    headers: { Range: range },
  });

  if (response.status !== 206) {
    throw new Error(`Range ${range} retornou HTTP ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function findSignatureReverse(buffer, signature, before = buffer.length) {
  for (
    let index = Math.min(before, buffer.length - 4);
    index >= 0;
    index -= 1
  ) {
    if (buffer.readUInt32LE(index) === signature) return index;
  }

  return -1;
}

function loadLocalEnvironment() {
  let contents;

  try {
    contents = readFileSync(".env", "utf8");
  } catch {
    return;
  }

  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);

    if (!match || process.env[match[1]]) continue;

    const value = match[2].replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2");
    process.env[match[1]] = value;
  }
}

function validateEnvironment() {
  const missing = requiredEnvironmentVariables.filter(
    (name) => !process.env[name]?.trim(),
  );

  if (missing.length > 0) {
    throw new Error(`Variaveis R2 ausentes: ${missing.join(", ")}`);
  }
}
