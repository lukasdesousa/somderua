"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";

type TawkApi = {
  maximize?: () => void;
  onLoad?: () => void;
};

declare global {
  interface Window {
    Tawk_API?: TawkApi;
  }
}

export default function LiveChatButton({
  onClick,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);

    if (event.defaultPrevented) return;

    const tawkApi = window.Tawk_API ?? (window.Tawk_API = {});

    if (typeof tawkApi.maximize === "function") {
      tawkApi.maximize();
      return;
    }

    const previousOnLoad = tawkApi.onLoad;
    tawkApi.onLoad = () => {
      previousOnLoad?.();
      window.Tawk_API?.maximize?.();
    };
  }

  return <button type={type} onClick={handleClick} {...props} />;
}
