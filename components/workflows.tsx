import Image from "next/image";
import WorkflowImg01 from "@/public/images/workflow-01.png";
import WorkflowImg02 from "@/public/images/workflow-02.png";
import WorkflowImg03 from "@/public/images/workflow-03.png";

const genres = [
  {
    name: "Funk automotivo",
    quantity: "+1.500 faixas",
    update: "Premium · atualizado até setembro/2026",
    image: WorkflowImg01,
  },
  {
    name: "Grave pesado",
    quantity: "+1.500 faixas",
    update: "Atualizacao semanal",
    image: WorkflowImg02,
  },
  {
    name: "Remix viral",
    quantity: "+1.500 faixas",
    update: "Atualizacao frequente",
    image: WorkflowImg03,
  },
  {
    name: "Favoritas do pen drive",
    quantity: "+1.500 faixas",
    update: "Curadoria revisada",
    image: WorkflowImg02,
  },
  {
    name: "Sertanejo e piseiro",
    quantity: "+1.500 faixas",
    update: "Pastas organizadas",
    image: WorkflowImg01,
  },
  {
    name: "Internacional",
    quantity: "+1.500 faixas",
    update: "Selecao para viagem",
    image: WorkflowImg03,
  },
];

const steps = [
  {
    number: "01",
    title: "Comprar",
    text: "Informe seu e-mail e finalize o pagamento no checkout seguro.",
  },
  {
    number: "02",
    title: "Receber",
    text: "Assim que o pagamento for aprovado, o acesso ao download e liberado automaticamente.",
  },
  {
    number: "03",
    title: "Aproveitar",
    text: "Baixe, copie as pastas para o dispositivo escolhido e ligue o som.",
  },
];

export default function Workflows() {
  return (
    <>
      <section className="bg-slate-950 py-14 md:py-20" aria-labelledby="genres-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-emerald-300">Generos</p>
              <h2 id="genres-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
                Uma biblioteca visual para cada momento do som.
              </h2>
            </div>
            <p className="text-lg text-slate-300">
              Da batida automotiva ao repertorio de viagem, a selecao aparece dividida em pastas para facilitar a copia e o uso.
            </p>
          </div>

          <div className="group mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {genres.map((genre) => (
              <a
                key={genre.name}
                className="group/card relative h-full overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-cyan-300/40"
                href="/baixar-musicas#escolha-seu-pack"
              >
                <Image
                  className="h-44 w-full object-cover opacity-85 transition duration-300 group-hover/card:scale-[1.03] group-hover/card:opacity-100"
                  src={genre.image}
                  width={350}
                  height={288}
                  alt={`Pasta ${genre.name} do Pack Som de Rua`}
                  loading="lazy"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">{genre.name}</h3>
                    <span className="rounded-lg bg-cyan-300/10 px-2 py-1 text-xs font-semibold text-cyan-100">
                      {genre.quantity}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">{genre.update}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#070a13] py-14 md:py-20" aria-labelledby="workflow-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-cyan-300">Como funciona</p>
            <h2 id="workflow-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
              Tres passos para sair da pagina com o repertorio pronto.
            </h2>
          </div>
          <ol className="mt-9 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.title} className="rounded-lg border border-white/10 bg-white/5 p-6">
                <span className="text-sm font-semibold text-emerald-300">{step.number}</span>
                <h3 className="mt-3 text-2xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center">
            <a className="btn bg-linear-to-t from-emerald-500 to-lime-400 text-slate-950 hover:from-emerald-400 hover:to-lime-300" href="/baixar-musicas#escolha-seu-pack">
              Comprar e receber acesso
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
