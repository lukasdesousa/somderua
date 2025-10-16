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
