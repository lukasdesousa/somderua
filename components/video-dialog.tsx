"use client";

import { useRef } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

type VideoDialogProps = {
  youtubeVideoId: string;
  title: string;
  onClose: () => void;
};

export default function VideoDialog({
  youtubeVideoId,
  title,
  onClose,
}: VideoDialogProps) {
  const playerRef = useRef<HTMLIFrameElement>(null);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeVideoId)}?autoplay=1&rel=0`;

  return (
    <Dialog initialFocus={playerRef} open onClose={onClose}>
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
            <iframe
              ref={playerRef}
              className="h-full w-full bg-black"
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
