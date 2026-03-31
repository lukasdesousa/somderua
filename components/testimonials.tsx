"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import useMasonry from "@/utils/useMasonry";
import Testimonial01 from "@/public/images/testimonial-01.jpg";
import Testimonial02 from "@/public/images/testimonial-02.jpg";
import Testimonial03 from "@/public/images/testimonial-03.jpg";

const testimonials = [
  {
    name: "Ricardo Gonçalves",
    date: "23/03/2026",
    content: "Chegou na hora 🔥 já botei no paredão e o grave veio muito forte.",
    avatar: Testimonial01,
  },
  {
    name: "João Ximenes",
    date: "19/03/2026",
    content: "Comprei sem acreditar muito, mas liberou na hora. Valeu cada real.",
    avatar: Testimonial02,
  },
  {
    name: "Márcia Lima",
    date: "11/03/2026",
    content: "Usei no carro e na caixa de som. Pasta bem organizada e sem faixa repetida.",
    avatar: Testimonial03,
  },
];

export default function Testimonials() {
  const masonryContainer = useMasonry();
  const [downloads, setDownloads] = useState(3000);

  useEffect(() => {
    setDownloads(3000 + Math.floor(Math.random() * 250));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
        <div className="mx-auto max-w-3xl pb-12 text-center">
          <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
            Prova social de quem já comprou
          </h2>
          <p className="text-lg text-indigo-200/75">+{downloads.toLocaleString("pt-BR")} downloads realizados</p>
        </div>

        <div className="mx-auto grid max-w-sm items-start gap-6 sm:max-w-none md:grid-cols-3" ref={masonryContainer}>
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
              <div className="mb-4 flex items-center gap-3">
                <Image src={testimonial.avatar} alt={testimonial.name} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-100">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.date}</p>
                </div>
              </div>
              <p className="text-indigo-100/80">“{testimonial.content}”</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            WhatsApp: “chegou na hora 🔥”
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            WhatsApp: “grave muito forte slk”
          </div>
        </div>
      </div>
    </div>
  );
}
