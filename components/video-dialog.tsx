"use client";

import { useRef } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

type VideoDialogProps = {
  video: string;
  videoWidth: number;
  videoHeight: number;
  loop: boolean;
  onClose: () => void;
};

export default function VideoDialog({
  video,
  videoWidth,
  videoHeight,
  loop,
  onClose,
}: VideoDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Dialog initialFocus={videoRef} open onClose={onClose}>
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
            <video
              ref={videoRef}
              className="h-full w-full bg-black object-contain"
              width={videoWidth}
              height={videoHeight}
              loop={loop}
              controls
              playsInline
              preload="metadata"
            >
              <source src={video} type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
