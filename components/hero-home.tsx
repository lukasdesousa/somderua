"use client";

import { useEffect, useMemo, useState } from "react";
import VideoThumb from "@/public/images/videoThumb.png";
import ModalVideo from "@/components/modal-video";

const COUNTDOWN_MINUTES = 20;

function formatTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now());
  const minutes = Math.floor(diff / 60000)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((diff % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function HeroHome() {
  const [timeLeft, setTimeLeft] = useState("20:00");
  const [todayPurchases, setTodayPurchases] = useState(120);

  useEffect(() => {
    const storageKey = "somderua_offer_ends_at";
    const current = localStorage.getItem(storageKey);
    const parsed = current ? Number(current) : NaN;
    const valid = Number.isFinite(parsed) && parsed > Date.now();
    const target = valid ? parsed : Date.now() + COUNTDOWN_MINUTES * 60_000;

    if (!valid) {
      localStorage.setItem(storageKey, String(target));
    }

    setTimeLeft(formatTimeLeft(target));
    const timer = setInterval(() => {
      if (target <= Date.now()) {
        const reset = Date.now() + COUNTDOWN_MINUTES * 60_000;
        localStorage.setItem(storageKey, String(reset));
        setTimeLeft(formatTimeLeft(reset));
        return;
      }
      setTimeLeft(formatTimeLeft(target));
    }, 1000);

    setTodayPurchases(120 + Math.floor(Math.random() * 25));

    return () => clearInterval(timer);
  }, []);

  const badges = useMemo(
    () => ["🔒 Compra segura", "⚡ Download imediato", "📱 Funciona no celular e carro"],
    [],
  );

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-16">
          <div className="pb-8 text-center md:pb-12">
            <span className="inline-flex rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200">
              🔥 Oferta termina hoje · {timeLeft}
            </span>
            <h1
              className="mt-6 animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
              data-aos="fade-up"
            >
              Mais de 4.500 músicas atualizadas pra fazer seu som bater forte HOJE
            </h1>
            <div className="mx-auto max-w-3xl">
              <p className="mb-6 text-lg text-indigo-100/80 md:text-xl" data-aos="fade-up" data-aos-delay={200}>
                Baixe agora e toque no seu carro em minutos — sem repetição, com grave ajustado pra paredão.
              </p>
              <p className="mb-8 text-sm font-medium text-emerald-300">Mais de {todayPurchases} compras hoje</p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <div data-aos="fade-up" data-aos-delay={400}>
                  <a
                    className="btn group mb-3 w-full bg-linear-to-t from-indigo-600 to-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] transition sm:mb-0 sm:w-auto"
                    href="/formulario"
                  >
                    <span className="relative inline-flex items-center font-semibold">
                      BAIXAR AGORA
                      <span className="ml-1 tracking-normal text-white/70 transition-transform group-hover:translate-x-0.5">-&gt;</span>
                    </span>
                  </a>
                  <p className="mt-2 text-xs text-indigo-100/75">
                    Download imediato • Garantia de 7 dias • Acesso vitalício
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {badges.map((badge) => (
                  <span key={badge} className="rounded-full border border-gray-700 bg-gray-900/80 px-3 py-1 text-xs text-gray-200">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ModalVideo
            thumb={VideoThumb}
            thumbWidth={1104}
            thumbHeight={576}
            thumbAlt="Prévia do pack de músicas Som de Rua"
            video="videos/somderua_preview.mp4"
            videoWidth={1920}
            videoHeight={1080}
          />
        </div>
      </div>
    </section>
  );
}
