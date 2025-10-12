"use client";

import { useState } from "react";
import useMasonry from "@/utils/useMasonry";

const testimonials = [
  {
    name: "Ricado Gonçalves",
    date: "23/03/2025",
    content:
      "Muito show! Comprei e chegou de imediato",
    categories: [1, 3, 5],
  },
  {
    name: "João Ximenes",
    date: "19/08/2025",
    content:
      "Top, meu amigo recomendou",
    categories: [1, 2, 4],
  },
  {
    name: "Carros_luxo13",
    date: "02/06/2025",
    content:
      "Coloquei no celta,bom de mas",
    categories: [1, 2, 5],
  },
  {
    name: "Ricardo",
    company: "Canon",
    date: "16/01/2025",
    content:
      "Gostei muito",
    categories: [1, 4],
  },
  {
    name: "Maria",
    company: "Cadbury",
    date: "09/10/2025",
    content:
      "Atendimento top de linha",
    categories: [1, 3, 5],
  },
  {
    name: "Antonio",
    date: "10/10/2025",
    content:
      "Confesso que estava com medo de me decepcionar, mas as músicas são muito boas!",
    categories: [1, 3],
  },
  {
    name: "Otacilia",
    date: "07/07/2025",
    content:
      "Bom pra viajar de caminhão, espanta o sono rsrs",
    categories: [1, 2, 5],
  },
  {
    name: "Maxilio Gomes",
    date: "22/05/2025",
    content:
      "É pra botar no carro e partir no mundao",
    categories: [1, 4],
  },
  {
    name: "Vasconcelos",
    date: "12/09/2025",
    content:
      "Muito bom e barato, realmente surpreendeu",
    categories: [1, 2],
  },
];

export default function Testimonials() {
  const masonryContainer = useMasonry();
  const [category, setCategory] = useState<number>(1);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
        {/* Section header */}
        <div className="mx-auto max-w-3xl pb-12 text-center">
          <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
            Não deixe essa oportunidade passar
          </h2>
          <p className="text-lg text-indigo-200/65">
            Aqui na som de rua queremos que você, nosso cliente, sempre saia na vantagem. Aqui há alguns dos relatos de outros compradores.
          </p>
        </div>

        <div>
          {/* Buttons */}
          <div className="flex justify-center pb-12 max-md:hidden md:pb-16">
            <div className="relative inline-flex flex-wrap justify-center rounded-[1.25rem] bg-gray-800/40 p-1">
              {/* Button #1 */}
              <button
                className={`flex h-8 flex-1 items-center gap-2.5 whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-indigo-200 ${category === 1 ? "relative bg-linear-to-b from-gray-900 via-gray-800/60 to-gray-900 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-indigo-500/0),--theme(--color-indigo-500/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]" : "opacity-65 transition-opacity hover:opacity-90"}`}
                aria-pressed={category === 1}
                onClick={() => setCategory(1)}
              >
                <svg
                  className='fill-current text-indigo-500'
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height={16}
                >
                  <path d="M.062 10.003a1 1 0 0 1 1.947.455c-.019.08.01.152.078.19l5.83 3.333c.052.03.115.03.168 0l5.83-3.333a.163.163 0 0 0 .078-.188 1 1 0 0 1 1.947-.459 2.161 2.161 0 0 1-1.032 2.384l-5.83 3.331a2.168 2.168 0 0 1-2.154 0l-5.83-3.331a2.162 2.162 0 0 1-1.032-2.382Zm7.854-7.981-5.83 3.332a.17.17 0 0 0 0 .295l5.828 3.33c.054.031.118.031.17.002l5.83-3.333a.17.17 0 0 0 0-.294L8.085 2.023a.172.172 0 0 0-.17-.001ZM9.076.285l5.83 3.332c1.458.833 1.458 2.935 0 3.768l-5.83 3.333c-.667.38-1.485.38-2.153-.001l-5.83-3.332c-1.457-.833-1.457-2.935 0-3.767L6.925.285a2.173 2.173 0 0 1 2.15 0Z" />
                </svg>
                <span>Avaliações</span>
              </button>
            </div>
          </div>

          {/* Cards */}
          <div
            className="mx-auto grid max-w-sm items-start gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3"
            ref={masonryContainer}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <Testimonial testimonial={testimonial} category={category}>
                  {testimonial.content}
                </Testimonial>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonial({
  testimonial,
  category,
  children,
}: {
  testimonial: {
    name: string;
    content: string;
    categories: number[];
    date: string;
  };
  category: number;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`relative rounded-2xl bg-linear-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-5 backdrop-blur-xs transition-opacity before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] ${!testimonial.categories.includes(category) ? "opacity-30" : ""}`}
    >
      <div className="flex flex-col gap-4">
        <p className="text-indigo-200/65 before:content-['“'] after:content-['”']">
          {children}
        </p>
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-gray-200">
            <span>{testimonial.name}</span>
            <span className="text-gray-700"> - </span>
            <span className="text-gray-500">{testimonial.date}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
