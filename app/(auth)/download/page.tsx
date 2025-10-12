export const metadata = {
  title: "Download - Som de rua",
  description: "Melhor pack de música 2025 para pen drive",
};

import PageIllustration from "@/components/page-illustration";
import DownloadHome from "@/components/download-home";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Suspense>
        <DownloadHome />
      </Suspense>
    </>
  );
}
