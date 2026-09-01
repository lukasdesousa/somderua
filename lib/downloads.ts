export const downloadProviders = ["direct", "google_drive"] as const;

export type DownloadProvider = (typeof downloadProviders)[number];

export function parseDownloadProvider(
  value: string | null,
): DownloadProvider | null {
  if (value === null) return "direct";
  return downloadProviders.includes(value as DownloadProvider)
    ? (value as DownloadProvider)
    : null;
}

export function normalizeGoogleDriveUrl(
  value: string | null | undefined,
): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    const isGoogleDriveHost =
      url.hostname === "drive.google.com" || url.hostname === "docs.google.com";

    if (url.protocol !== "https:" || !isGoogleDriveHost) return null;
    return url.toString();
  } catch {
    return null;
  }
}
