"use client";

import { useEffect } from "react";

export default function AosInit() {
  useEffect(() => {
    const setupAos = async () => {
      const AOS = (await import("aos")).default;
      AOS.init({ once: true, disable: "phone", duration: 600, easing: "ease-out-sine" });
    };

    setupAos();
  }, []);

  return null;
}
