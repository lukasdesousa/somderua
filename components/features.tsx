import Image from "next/image";
import BlurredShapeGray from "@/public/images/blurred-shape-gray.svg";
import BlurredShape from "@/public/images/blurred-shape.svg";

const trustItems = [
  {
    title: "Pagamento 100% seguro",
    text: "Checkout protegido e processamento automático com confirmação em poucos segundos.",
  },
  {
    title: "Entrega automática imediata",
    text: "Pagou, liberou. Você recebe acesso na hora para baixar e usar no carro ou no celular.",
  },
  {
    title: "Sem músicas repetidas",
    text: "Repertório organizado para tocar por horas sem repetir as mesmas faixas.",
  },
];

export default function Features() {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -mt-20 -translate-x-1/2" aria-hidden="true">
        <Image className="max-w-none" src={BlurredShapeGray} width={760} height={668} alt="" loading="lazy" />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-80 -translate-x-[120%] opacity-50" aria-hidden="true">
        <Image className="max-w-none" src={BlurredShape} width={760} height={668} alt="" loading="lazy" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
          <div className="mx-auto max-w-3xl pb-8 text-center md:pb-12">
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Teste por 7 dias sem risco
            </h2>
            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5 text-left">
              <p className="text-base font-medium text-emerald-200 md:text-lg">
                Teste por 7 dias. Se não gostar, devolvemos 100% do seu dinheiro. Sem perguntas.
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-sm gap-4 sm:max-w-none md:grid-cols-3">
            {trustItems.map((item) => (
              <article key={item.title} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
                <h3 className="mb-2 font-nacelle text-lg font-semibold text-gray-100">{item.title}</h3>
                <p className="text-sm text-indigo-100/75">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
