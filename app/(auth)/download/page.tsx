import { Suspense } from "react";
import type { Metadata } from "next";
import DownloadHome from "@/components/download-home";
import PageIllustration from "@/components/page-illustration";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Download do repertório",
  description: "Área de download do repertório adquirido.",
  path: "/download",
  noIndex: true,
});

export default function DownloadPage() {
  return (
    <>
      <PageIllustration />
      <Suspense>
        <DownloadHome />
      </Suspense>
    </>
  );
}
