import Link from "next/link";
import type { Metadata } from "next";
import Cta from "@/components/cta";
import Features from "@/components/features";
import Hero from "@/components/hero-home";
import Testimonials from "@/components/testimonials";
import Workflows from "@/components/workflows";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import ConversionWidgets from "@/components/conversion-widgets";
import { buildMetadata } from "@/lib/seo/metadata";
import { digitalProduct, offerPriceLabels, packOfferList } from "@/lib/pricing";
import { breadcrumbSchema, faqPageSchema, productOffersSchema, websiteSchema } from "@/lib/seo/schema";

export const revalidate = 3600;

const includedItems = [
  {
    title: "De 16 GB a mais de 28 GB",
    text: "Escolha o tamanho ideal e copie o repertorio para pen drive, notebook, celular ou central multimidia.",
  },
  {
    title: "Pastas por estilo",
    text: "Funk, remix, paredao, automotivo, internacional, piseiro, sertanejo e selecoes para viagem.",
  },
  {
    title: "Organizacao para uso real",
    text: "Arquivos separados por momento, intensidade e tipo de som para reduzir procura manual.",
  },
  {
    title: "Acesso automatico",
    text: "Depois da aprovacao do pagamento, o download fica disponivel sem envio manual.",
  },
  {
    title: "Reembolso e suporte",
    text: "Se uma falha técnica impedir o acesso e não puder ser solucionada, o reembolso é integral.",
  },
  {
    title: "Guias de uso",
    text: "Conteudos para organizar pen drive, baixar musicas e evitar erros comuns em aparelhos.",
  },
];

const updateItems = [
  {
    title: "Curadoria constante",
    text: "O repertorio acompanha estilos que giram em carro, festa, viagem e paredao.",
  },
  {
    title: "Pastas revisadas",
    text: "A organizacao prioriza faixas faceis de encontrar e sequencias praticas para copiar.",
  },
  {
    title: "Custo-beneficio preservado",
    text: "Voce compra uma biblioteca pronta em vez de perder horas baixando arquivo por arquivo.",
  },
];

const comparisonRows = [
  {
    label: "Organizacao",
    ours: "Pastas por estilo, momento e uso",
    others: "Arquivos soltos ou pouco claros",
  },
  {
    label: "Entrega",
    ours: "Download liberado apos aprovacao",
    others: "Dependencia de envio manual",
  },
  {
    label: "Compatibilidade",
    ours: "Pensado para carro, USB, celular e notebook",
    others: "Foco limitado em um unico aparelho",
  },
  {
    label: "Seguranca",
    ours: "Checkout externo pelo Mercado Pago",
    others: "Pagamento sem fluxo reconhecivel",
  },
  {
    label: "Suporte",
    ours: "Suporte e reembolso por falha técnica",
    others: "Pouca clareza depois da compra",
  },
];

const homeFaqs = [
  {
    question: "O que vem no Pack Som de Rua?",
    answer:
      "Um repertorio com mais de 10 mil musicas organizado em pastas para pen drive, carro, caixa de som, celular e paredao.",
  },
  {
    question: "O download e liberado na hora?",
    answer:
      "Sim. Depois que o pagamento e aprovado, o acesso ao download e liberado automaticamente.",
  },
  {
    question: "Funciona em pen drive comum?",
    answer:
      "Sim. Voce baixa os arquivos, copia para o pen drive e usa em aparelhos compativeis com reproducao por USB.",
  },
  {
    question: "Posso baixar pelo celular?",
    answer:
      "Pode. Para copiar para pen drive, o computador costuma ser mais pratico, mas o acesso tambem funciona pelo celular.",
  },
  {
    question: "Quando há reembolso?",
    answer:
      "O reembolso e integral quando uma falha do sistema, do download ou outro problema tecnico impedir o acesso e nao puder ser solucionado, sem prejuizo dos direitos previstos na legislacao aplicavel.",
  },
  {
    question: "Qual e o valor atual?",
    answer: `O Pack Basico de 16 GB custa ${offerPriceLabels.entry}. O Pack Premium com mais de 28 GB custa ${offerPriceLabels.recommended} e inclui os hits atuais. Ambos sao vendidos em ${offerPriceLabels.installment}.`,
  },
];

const relatedLinks = [
  {
    href: "/musicas-para-pen-drive",
    title: "Musicas para pen drive",
    text: "Veja como usar o repertorio em pen drive comum e som automotivo.",
  },
  {
    href: "/musicas-para-paredao",
    title: "Musicas para paredao",
    text: "Entenda a selecao para grave forte, som automotivo e festas.",
  },
  {
    href: "/musicas-para-som-automotivo",
    title: "Musicas para som automotivo",
    text: "Veja como escolher repertorio para carro, grave e uso em USB.",
  },
  {
    href: "/baixar-musicas",
    title: "Baixar musicas",
    text: "Confira como funciona o acesso imediato apos o pagamento.",
  },
  {
    href: "/blog",
    title: "Guias de repertorio",
    text: "Leia dicas para organizar pastas, resolver erros no pen drive e escolher musicas.",
  },
];

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Pack de musicas 2026 para pen drive e paredao",
    description:
      "Compre o Pack Som de Rua com mais de 10 mil musicas organizadas para carro, pen drive, som automotivo e paredao, com download automatico.",
    path: "/",
    keywords: ["pack de musicas", "pack de musicas 2026", "pack de musicas para pen drive", "download imediato de musicas"],
  });
}

export default function Home() {
  const breadcrumbs = [{ name: "Inicio", path: "/" }];

  return (
    <>
      <JsonLd id="website-jsonld" data={websiteSchema()} />
      <JsonLd id="home-breadcrumb-jsonld" data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        id="home-product-jsonld"
        data={productOffersSchema({
          name: digitalProduct.checkoutName,
          description: digitalProduct.description,
          productPath: "/",
          offers: packOfferList.map((offer) => ({
            name: offer.name,
            description: offer.description,
            price: offer.price,
            currency: digitalProduct.currency,
            offerPath: "/baixar-musicas#escolha-seu-pack",
          })),
        })}
      />
      <JsonLd id="home-faq-jsonld" data={faqPageSchema(homeFaqs)} />
      <Breadcrumbs items={[{ name: "Inicio" }]} />
      <Hero />
      <Features />
      <Workflows />

      <section className="bg-slate-950 py-14 md:py-20" aria-labelledby="included-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-emerald-300">O que esta incluso</p>
            <h2 id="included-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
              Uma biblioteca pronta, com cara de produto profissional.
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              O objetivo e voce comprar uma vez, baixar sem friccao e ter um acervo organizado para varios contextos.
            </p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {includedItems.map((item) => (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/5 p-5">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{item.text}</p>
              </article>
            ))}
          </div>
          <SectionCta text="Ver oferta do Pack Premium" />
        </div>
      </section>

      <section className="bg-[#070a13] py-14 md:py-20" aria-labelledby="updates-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase text-cyan-300">Atualizacoes</p>
              <h2 id="updates-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
                Um pack que acompanha o que toca na rua.
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                A proposta e manter uma base moderna, organizada e util para quem precisa de repertorio sem ficar garimpando.
              </p>
            </div>
            <div className="grid gap-4">
              {updateItems.map((item) => (
                <article key={item.title} className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-14 md:py-20" aria-labelledby="comparison-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-amber-300">Comparativo</p>
            <h2 id="comparison-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
              O que muda quando o pack e pensado para conversao, entrega e uso real.
            </h2>
          </div>
          <div className="mt-9 overflow-hidden rounded-lg border border-white/10">
            <table className="w-full border-collapse bg-[#090d17] text-left text-sm">
              <caption className="sr-only">Comparacao entre o Pack Som de Rua e outros packs</caption>
              <thead className="bg-white/5 text-slate-200">
                <tr>
                  <th className="px-4 py-4 font-semibold" scope="col">Criterio</th>
                  <th className="px-4 py-4 font-semibold" scope="col">Som de Rua</th>
                  <th className="px-4 py-4 font-semibold" scope="col">Outros packs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-300">
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <th className="px-4 py-4 font-semibold text-white" scope="row">{row.label}</th>
                    <td className="px-4 py-4">{row.ours}</td>
                    <td className="px-4 py-4 text-slate-500">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SectionCta text="Escolher entre Básico e Premium" />
        </div>
      </section>

      <Testimonials />

      <section className="bg-slate-950 py-14 md:py-20" aria-labelledby="home-faq-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase text-cyan-300">FAQ</p>
              <h2 id="home-faq-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
                Duvidas comuns antes de baixar.
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                Respostas diretas para voce entender compra, acesso, compatibilidade e reembolso.
              </p>
            </div>
            <div className="grid gap-3">
              {homeFaqs.map((faq) => (
                <details key={faq.question} className="group rounded-lg border border-white/10 bg-white/5 p-5">
                  <summary className="cursor-pointer list-none text-base font-semibold text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm text-slate-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#070a13] py-14 md:py-20" aria-labelledby="related-content-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-emerald-300">Guias complementares</p>
            <h2 id="related-content-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
              Continue por guias especificos de uso e organizacao.
            </h2>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {relatedLinks.map((item) => (
              <Link
                key={item.href}
                className="rounded-lg border border-white/10 bg-white/5 p-5 transition hover:border-cyan-300/40 hover:bg-white/10"
                href={item.href}
              >
                <span className="text-lg font-semibold text-white">{item.title}</span>
                <span className="mt-2 block text-sm text-slate-400">{item.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Cta />
      <ConversionWidgets />
    </>
  );
}

function SectionCta({ text }: { text: string }) {
  return (
    <div className="mt-8 text-center">
      <Link className="btn bg-white text-slate-950 hover:bg-emerald-200" href="/baixar-musicas#escolha-seu-pack">
        {text}
      </Link>
    </div>
  );
}
