"use client";

import { useEffect } from "react";
import "aos/dist/aos.css";
import Footer from "@/components/ui/footer";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const setupAos = async () => {
      const AOS = (await import("aos")).default;
      AOS.init({ once: true, disable: "phone", duration: 600, easing: "ease-out-sine" });
    };

    setupAos();
  }, []);

  return (
    <>
      <main className="relative flex grow flex-col">{children}</main>
      <Footer />
    </>
  );
}
