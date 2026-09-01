"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";

const VideoDialog = dynamic(() => import("@/components/video-dialog"), {
  ssr: false,
});

interface ModalVideoProps {
  thumb: StaticImageData;
  thumbWidth: number;
  thumbHeight: number;
  thumbAlt: string;
  youtubeVideoId: string;
  ariaLabel?: string;
  buttonLabel?: string;
  buttonMeta?: string;
}

export default function ModalVideo({
  thumb,
  thumbWidth,
  thumbHeight,
  thumbAlt,
  youtubeVideoId,
  ariaLabel = "Ver prévia em vídeo do pack de músicas",
  buttonLabel = "Ver prévia do pack",
  buttonMeta = "Vídeo de 3 minutos",
}: ModalVideoProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="group relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
        onClick={() => {
          setModalOpen(true);
        }}
        aria-label={ariaLabel}
      >
        <Image
          className="w-full object-cover opacity-90 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
          src={thumb}
          width={thumbWidth}
          height={thumbHeight}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 1104px"
          alt={thumbAlt}
        />
        <span
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.42))]"
          aria-hidden="true"
        />
        <span className="pointer-events-none absolute flex items-center gap-3 rounded-lg border border-white/20 bg-slate-950/90 px-4 py-3 text-left shadow-2xl backdrop-blur">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-300 text-slate-950">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              fill="none"
              aria-hidden="true"
            >
              <path fill="currentColor" d="M5.5 3.8v10.4l8-5.2-8-5.2Z" />
            </svg>
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">
              {buttonLabel}
            </span>
            <span className="block text-xs text-slate-300">{buttonMeta}</span>
          </span>
        </span>
      </button>

      {modalOpen ? (
        <VideoDialog
          youtubeVideoId={youtubeVideoId}
          title={thumbAlt}
          onClose={() => setModalOpen(false)}
        />
      ) : null}
    </div>
  );
}
