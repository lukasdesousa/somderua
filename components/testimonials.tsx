import Image from "next/image";
import Testimonial01 from "@/public/images/testimonial-01.jpg";
import Testimonial02 from "@/public/images/testimonial-02.jpg";
import Testimonial03 from "@/public/images/testimonial-03.jpg";
import Testimonial04 from "@/public/images/testimonial-04.jpg";
import Testimonial05 from "@/public/images/testimonial-05.jpg";
import Testimonial06 from "@/public/images/testimonial-06.jpg";

const testimonials = [
  {
    name: "Ricardo Goncalves",
    city: "Fortaleza, CE",
    rating: "5,0",
    content: "Comprei para o paredao e liberou rapido. As pastas vieram bem separadas e o grave ficou forte no carro.",
    avatar: Testimonial01,
  },
  {
    name: "Joao Ximenes",
    city: "Natal, RN",
    rating: "5,0",
    content: "Eu perdia muito tempo montando pen drive. Agora so copio a pasta certa e ja fica pronto para a semana.",
    avatar: Testimonial02,
  },
  {
    name: "Marcia Lima",
    city: "Recife, PE",
    rating: "4,9",
    content: "Usei no carro e na caixa de som. O repertorio veio organizado e facil de achar por estilo.",
    avatar: Testimonial03,
  },
  {
    name: "Caio Martins",
    city: "Goiania, GO",
    rating: "5,0",
    content: "A compra foi simples, o acesso chegou depois da confirmacao e consegui colocar tudo no pen drive.",
    avatar: Testimonial04,
  },
  {
    name: "Bruna Alves",
    city: "Sao Luis, MA",
    rating: "4,9",
    content: "Gostei porque nao veio baguncado. Tem pasta para viagem, para festa e para som mais pesado.",
    avatar: Testimonial05,
  },
  {
    name: "Wesley Rocha",
    city: "Teresina, PI",
    rating: "5,0",
    content: "Boa variedade de funk, remix e paredao. Valeu pelo custo-beneficio e pela entrega automatica.",
    avatar: Testimonial06,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#070a13] py-14 md:py-20" aria-labelledby="testimonials-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-amber-300">Depoimentos</p>
            <h2 id="testimonials-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
              Pessoas reais usando o pack no carro, no pen drive e no paredao.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="font-nacelle text-3xl font-semibold text-white">4,9/5</p>
              <p className="mt-1 text-sm text-slate-400">avaliacao media</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="font-nacelle text-3xl font-semibold text-white">+3.000</p>
              <p className="mt-1 text-sm text-slate-400">downloads realizados</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="font-nacelle text-3xl font-semibold text-white">7 dias</p>
              <p className="mt-1 text-sm text-slate-400">garantia de teste</p>
            </div>
          </div>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-lg border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-lg object-cover"
                  sizes="48px"
                />
                <div>
                  <h3 className="text-sm font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-xs text-slate-400">{testimonial.city}</p>
                </div>
                <span className="ml-auto rounded-lg bg-amber-300/10 px-2 py-1 text-xs font-bold text-amber-200">
                  {testimonial.rating}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-300">&quot;{testimonial.content}&quot;</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
