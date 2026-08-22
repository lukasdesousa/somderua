import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import ModalVideo from "@/components/modal-video";
import VideoThumb from "@/public/images/tutorial-thumb.png";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const tutorialSteps = [
  {
    title: "Abra seu acesso",
    description: "Use o botão de download recebido por e-mail depois que o pagamento for aprovado.",
  },
  {
    title: "Baixe o arquivo",
    description: "Escolha uma pasta fácil de encontrar e aguarde o download terminar por completo.",
  },
  {
    title: "Extraia o conteúdo",
    description: "Abra o arquivo compactado e extraia as pastas antes de copiar as músicas.",
  },
  {
    title: "Transfira e aproveite",
    description: "Copie as pastas para o celular, computador ou pen drive e teste no seu aparelho.",
  },
];

const preparationTips = [
  {
    title: "Espaço disponível",
    description: "Separe espaço para o arquivo baixado e para as pastas que serão extraídas.",
  },
  {
    title: "Internet estável",
    description: "Packs grandes podem levar algum tempo. Evite fechar o navegador durante o download.",
  },
  {
    title: "Pasta organizada",
    description: "Crie uma pasta chamada Som de Rua para localizar o conteúdo com facilidade depois.",
  },
];

const faqs = [
  {
    question: "Posso baixar pelo celular?",
    answer: "Sim. Para transferir muitas músicas para um pen drive, o computador costuma deixar o processo mais simples.",
  },
  {
    question: "Por que o arquivo não abre logo após baixar?",
    answer: "O conteúdo pode estar compactado. Primeiro extraia o arquivo e depois abra ou copie as pastas de músicas.",
  },
  {
    question: "O que faço se o download parar?",
    answer: "Confira sua conexão e tente novamente pelo link recebido. Se o problema continuar, fale com o suporte.",
  },
];

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Tutorial Som de Rua: como baixar e usar seu pack",
    description: "Tutorial em vídeo para baixar, extrair e transferir o Pack Som de Rua para celular, computador ou pen drive.",
    path: "/tutorial",
    keywords: ["tutorial Som de Rua", "como baixar pack de músicas", "como passar músicas para pen drive"],
  });
}

export default function TutorialPage() {
  const crumbs = [
    { name: "Início", path: "/" },
    { name: "Tutorial", path: "/tutorial" },
  ];

  return (
    <>
      <JsonLd id="tutorial-breadcrumb" data={breadcrumbSchema(crumbs)} />
      <JsonLd id="tutorial-faq" data={faqPageSchema(faqs)} />
      <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Tutorial" }]} />

      <main className="relative isolate overflow-hidden" aria-labelledby="tutorial-title">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.18),transparent_58%)]"
          aria-hidden="true"
        />

        <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 sm:px-6 md:pb-14 md:pt-12">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
              Guia rápido e completo
            </span>
            <h1 id="tutorial-title" className="mt-5 font-nacelle text-4xl font-semibold text-white md:text-6xl">
              Do download ao primeiro play, sem complicação.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Assista ao tutorial e veja como baixar, extrair e transferir seu Pack Som de Rua para o dispositivo que você usa.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-slate-300">
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Download seguro</span>
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Extração passo a passo</span>
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Celular, computador e pen drive</span>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-3">
            <ModalVideo
              thumb={VideoThumb}
              thumbWidth={1104}
              thumbHeight={576}
              thumbAlt="Tutorial para baixar e usar o Pack Som de Rua"
              video="/videos/somderua-tutorial.mp4"
              videoWidth={1920}
              videoHeight={1080}
              ariaLabel="Assistir ao tutorial do Pack Som de Rua"
              buttonLabel="Assistir ao tutorial"
              buttonMeta="Download, extração e transferência"
              loop={false}
            />
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025]" aria-labelledby="tutorial-steps-title">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Resumo do processo</p>
              <h2 id="tutorial-steps-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
                Quatro passos para começar a ouvir
              </h2>
            </div>

            <ol className="mt-8 grid gap-4 md:grid-cols-2">
              {tutorialSteps.map((step, index) => (
                <li key={step.title} className="group rounded-2xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-emerald-400/30 hover:bg-slate-900/80">
                  <div className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-300 font-nacelle text-lg font-semibold text-slate-950">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-nacelle text-xl font-semibold text-white">{step.title}</h3>
                      <p className="mt-2 leading-relaxed text-slate-400">{step.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:py-20" aria-labelledby="prepare-title">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-300">Antes de começar</p>
            <h2 id="prepare-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
              Prepare tudo para um download tranquilo
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              Alguns cuidados simples evitam interrupções e ajudam você a encontrar o repertório depois da extração.
            </p>
          </div>

          <div className="grid gap-4">
            {preparationTips.map((tip) => (
              <article key={tip.title} className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.06] p-5">
                <h3 className="font-nacelle text-lg font-semibold text-indigo-100">{tip.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-400">{tip.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 md:pb-24" aria-labelledby="tutorial-faq-title">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 sm:p-8 md:p-10">
            <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Ajuda rápida</p>
                <h2 id="tutorial-faq-title" className="mt-3 font-nacelle text-3xl font-semibold text-white">
                  Dúvidas comuns
                </h2>
                <p className="mt-4 text-slate-400">Se ainda precisar, nossa área de suporte está logo abaixo.</p>
              </div>
              <div className="grid gap-4">
                {faqs.map((faq) => (
                  <article key={faq.question} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-white">{faq.question}</h3>
                    <p className="mt-2 leading-relaxed text-slate-400">{faq.answer}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-5 text-center sm:flex-row sm:text-left">
              <div>
                <h3 className="font-nacelle text-xl font-semibold text-white">Ainda precisa de ajuda?</h3>
                <p className="mt-1 text-sm text-slate-400">Fale com o suporte e conte em qual etapa encontrou dificuldade.</p>
              </div>
              <Link href="/suporte" className="btn shrink-0 bg-linear-to-t from-emerald-500 to-lime-400 font-bold text-slate-950 hover:from-emerald-400 hover:to-lime-300">
                Falar com o suporte
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
