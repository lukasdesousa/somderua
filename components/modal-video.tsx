"use client";

import { useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Image from "next/image";

interface ModalVideoProps {
  thumb: StaticImageData;
  thumbWidth: number;
  thumbHeight: number;
  thumbAlt: string;
  video: string;
  videoWidth: number;
  videoHeight: number;
}

export default function ModalVideo({
  thumb,
  thumbWidth,
  thumbHeight,
  thumbAlt,
  video,
  videoWidth,
  videoHeight,
}: ModalVideoProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative">
      <button
        className="group relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
        onClick={() => {
          setModalOpen(true);
        }}
        aria-label="Ver prévia em vídeo do pack de músicas"
        data-aos="fade-up"
        data-aos-delay={200}
      >
        <Image
          className="w-full object-cover opacity-90 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
          src={thumb}
          width={thumbWidth}
          height={thumbHeight}
          priority
          sizes="(max-width: 768px) 100vw, 1104px"
          alt={thumbAlt}
        />
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.42))]" aria-hidden="true" />
        <span className="pointer-events-none absolute flex items-center gap-3 rounded-lg border border-white/20 bg-slate-950/90 px-4 py-3 text-left shadow-2xl backdrop-blur">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-300 text-slate-950">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" aria-hidden="true">
              <path fill="currentColor" d="M5.5 3.8v10.4l8-5.2-8-5.2Z" />
            </svg>
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">Ver prévia do pack</span>
            <span className="block text-xs text-slate-300">Video de 3 minutos</span>
          </span>
        </span>
      </button>

      <Dialog initialFocus={videoRef} open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogBackdrop
          transition
          className="fixed inset-0 z-[99999] bg-black/75 transition-opacity duration-300 ease-out data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-[99999] flex px-4 py-6 sm:px-6">
          <div className="mx-auto flex h-full max-w-6xl items-center">
            <DialogPanel
              transition
              className="aspect-video max-h-full w-full overflow-hidden rounded-lg bg-black shadow-2xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
            >
              <video ref={videoRef} width={videoWidth} height={videoHeight} loop controls>
                <source src={video} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
