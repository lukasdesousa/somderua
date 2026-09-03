import type { Metadata } from "next";
import LiveChatButton from "@/components/live-chat-button";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

const supportEmail = "somderua.suporte@gmail.com";
const supportHref = `mailto:${supportEmail}?subject=Suporte%20Som%20de%20Rua`;

const supportTopics = [
  {
    title: "Acesso e download",
    text: "Ajuda para localizar o acesso, baixar o pack ou entender a liberação após a aprovação.",
  },
  {
    title: "Compra e pagamento",
    text: "Orientações sobre a oferta escolhida, confirmação do pagamento e dados do pedido.",
  },
  {
    title: "Uso do repertório",
    text: "Dúvidas para abrir o arquivo, organizar as pastas ou transferir as músicas para seu dispositivo.",
  },
];

const messageChecklist = [
  "Nome e e-mail usados na compra",
  "Pack escolhido: Básico ou Premium",
  "Descrição objetiva do que aconteceu",
  "Captura de tela do erro, se houver",
];

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Suporte para compra, acesso e download",
    description: "Fale com o suporte do Som de Rua pelo chat ao vivo ou por e-mail para receber ajuda com compra, acesso, download ou uso do seu pack.",
    path: "/suporte",
    keywords: ["suporte Som de Rua", "ajuda com download", "contato Som de Rua"],
  });
}

export default function SuportePage() {
  const crumbs = [
    { name: "Início", path: "/" },
    { name: "Suporte", path: "/suporte" },
  ];

  return (
    <>
      <JsonLd id="suporte-breadcrumb" data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Suporte" }]} />

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-12">
        <section
          className="relative isolate overflow-hidden rounded-3xl border border-emerald-300/20 bg-[linear-gradient(145deg,rgba(16,185,129,0.16),rgba(15,23,42,0.96)_48%,rgba(79,70,229,0.14))] px-6 py-10 shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:px-9 md:px-12 md:py-14"
          aria-labelledby="support-title"
        >
          <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" aria-hidden="true" />

          <div className="grid gap-9 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <div>
              <p className="inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                Central de suporte
              </p>
              <h1 id="support-title" className="mt-5 max-w-2xl font-nacelle text-4xl font-semibold leading-tight text-white md:text-5xl">
                Precisa de ajuda? Fale com a gente.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
                Converse com nossa equipe pelo chat ao vivo ou envie um e-mail. Estamos aqui para ajudar com sua compra, acesso, download ou uso do pack.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-slate-300">
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-emerald-100">Chat ao vivo</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Todos os dias</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Das 9h às 17h</span>
              </div>
            </div>

            <aside className="rounded-2xl border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-slate-950/40 sm:p-7" aria-label="Canais de atendimento">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7.5 18.5 3.5 21v-5.15A8.5 8.5 0 1 1 7.5 18.5Z" />
                    <path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" strokeLinecap="round" strokeWidth="2.4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-200">Chat ao vivo</p>
                  <p className="mt-1 font-nacelle text-xl font-semibold text-white">Todos os dias, das 9h às 17h</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Se nossa equipe estiver offline, você também pode deixar sua mensagem no chat. Responderemos assim que o atendimento estiver disponível.
              </p>
              <LiveChatButton className="btn mt-6 min-h-12 w-full bg-linear-to-t from-emerald-500 to-lime-400 text-center font-bold text-slate-950 shadow-lg shadow-emerald-950/30 hover:from-emerald-400 hover:to-lime-300">
                Abrir chat ao vivo
              </LiveChatButton>

              <div className="my-6 flex items-center gap-3" aria-hidden="true">
                <span className="h-px grow bg-white/10" />
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">ou por e-mail</span>
                <span className="h-px grow bg-white/10" />
              </div>

              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-indigo-300/15 bg-indigo-300/10 text-indigo-200" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 6.75A1.75 1.75 0 0 1 5.75 5h12.5A1.75 1.75 0 0 1 20 6.75v10.5A1.75 1.75 0 0 1 18.25 19H5.75A1.75 1.75 0 0 1 4 17.25V6.75Z" />
                    <path d="m5 7 7 5 7-5" />
                  </svg>
                </div>
                <a className="min-w-0 break-all text-sm font-semibold text-white transition hover:text-indigo-200" href={supportHref}>
                  {supportEmail}
                </a>
              </div>
              <a
                href={supportHref}
                className="btn-sm mt-4 w-full border border-white/10 bg-white/10 text-center text-white hover:bg-white/15"
              >
                Enviar e-mail ao suporte
              </a>
            </aside>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="support-topics-title">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-300">Como podemos ajudar</p>
            <h2 id="support-topics-title" className="mt-2 font-nacelle text-3xl font-semibold text-white md:text-4xl">
              Suporte para cada etapa da sua experiência
            </h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {supportTopics.map((topic, index) => (
              <article key={topic.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-300/25 hover:bg-white/[0.07]">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-400/10 font-nacelle text-sm font-semibold text-indigo-200" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{topic.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{topic.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 rounded-2xl border border-white/10 bg-slate-900/45 p-6 md:grid-cols-[0.85fr_1.15fr] md:p-8" aria-labelledby="message-checklist-title">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-300">Antes de enviar</p>
            <h2 id="message-checklist-title" className="mt-2 font-nacelle text-3xl font-semibold text-white">
              Inclua os detalhes do seu pedido
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Essas informações ajudam a equipe a entender sua solicitação e encontrar sua compra com mais facilidade.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {messageChecklist.map((item) => (
              <li key={item} className="flex gap-3 rounded-xl border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-300/10 text-xs text-emerald-200" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 flex flex-col gap-5 rounded-2xl border border-indigo-300/15 bg-indigo-400/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between md:p-8" aria-labelledby="support-security-title">
          <div className="max-w-3xl">
            <h2 id="support-security-title" className="text-lg font-semibold text-white">Proteja seus dados</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Nunca envie senhas ou dados completos do cartão. Para sua segurança, confira se o destinatário é exatamente {supportEmail}.
            </p>
          </div>
          <a href={supportHref} className="btn-sm shrink-0 border border-white/10 bg-white/10 text-white hover:bg-white/15">
            Abrir meu e-mail
          </a>
        </section>
      </div>
    </>
  );
}
