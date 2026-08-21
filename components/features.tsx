const trustItems = [
  {
    label: "Seguro",
    title: "Compra protegida",
    text: "Pagamento processado fora do site pelo Mercado Pago, com confirmacao automatica.",
  },
  {
    label: "PIX",
    title: "Entrega imediata",
    text: "Aprovou, liberou. O acesso ao download aparece logo apos a confirmacao.",
  },
  {
    label: "USB",
    title: "Feito para qualquer rotina",
    text: "Baixe no celular ou computador e copie para pen drive, carro, notebook ou TV.",
  },
  {
    label: "100%",
    title: "Reembolso por falha técnica",
    text: "Se uma falha técnica impedir o acesso e não puder ser solucionada, o reembolso é integral.",
  },
  {
    label: "Atual",
    title: "Repertorio vivo",
    text: "Pastas pensadas para acompanhar virais, grave automotivo e estilos pedidos.",
  },
];

const stats = [
  { value: "+25 mil", label: "arquivos e variacoes catalogadas no acervo" },
  { value: "+40", label: "generos, pastas e momentos de uso" },
  { value: "320kbps", label: "qualidade indicada para som automotivo" },
  { value: "100%", label: "organizado para copiar e tocar" },
];

const compatibility = [
  "Carro",
  "Central multimidia",
  "Pen drive",
  "USB",
  "Notebook",
  "Android",
  "iPhone",
  "Bluetooth",
  "TV",
];

const benefits = [
  {
    label: "Organizacao",
    title: "Pastas prontas para tocar",
    text: "Nada de baixar musica solta. O pack chega dividido por estilo, intensidade e situacao de uso.",
  },
  {
    label: "Velocidade",
    title: "Menos procura, mais som",
    text: "Voce pula a curadoria manual e ganha um repertorio consistente para festas, viagens e rua.",
  },
  {
    label: "Qualidade",
    title: "Audio pensado para volume",
    text: "Selecao focada em grave limpo e faixas que funcionam bem em som automotivo e caixas.",
  },
  {
    label: "Confianca",
    title: "Fluxo de acesso automatizado",
    text: "O pagamento aprovado libera o download sem depender de envio manual por mensagem.",
  },
  {
    label: "Praticidade",
    title: "Funciona no seu jeito de usar",
    text: "Baixe pelo dispositivo que preferir e leve para pen drive, central multimidia ou notebook.",
  },
  {
    label: "Custo-beneficio",
    title: "Um pack, varias ocasioes",
    text: "Um unico acesso cobre carro, paredao, churrasco, viagem e uso diario.",
  },
];

export default function Features() {
  return (
    <>
      <section className="border-y border-white/10 bg-slate-950" aria-label="Barra de confianca">
        <div className="mx-auto grid max-w-6xl gap-px px-4 sm:px-6 md:grid-cols-5">
          {trustItems.map((item) => (
            <article key={item.title} className="bg-[#090d17] px-4 py-5">
              <span className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg bg-cyan-300/10 px-2 text-xs font-bold uppercase text-cyan-100">
                {item.label}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#070a13] py-14 md:py-20" aria-labelledby="stats-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-emerald-300">Numeros que importam</p>
              <h2 id="stats-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
                Grande o suficiente para tocar por horas. Simples o bastante para usar hoje.
              </h2>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <dt className="text-sm text-slate-400">{stat.label}</dt>
                  <dd className="mt-2 font-nacelle text-4xl font-semibold text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-14 md:py-20" aria-labelledby="compatibility-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase text-cyan-300">Compatibilidade</p>
              <h2 id="compatibility-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
                Do download ao pen drive, sem depender de app especifico.
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                O pack foi pensado para quem quer baixar, copiar e tocar em equipamentos comuns do dia a dia.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {compatibility.map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#070a13] py-14 md:py-20" aria-labelledby="benefits-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-amber-300">Beneficios</p>
            <h2 id="benefits-title" className="mt-3 font-nacelle text-3xl font-semibold text-white md:text-4xl">
              O pack resolve o trabalho chato antes de voce ligar o som.
            </h2>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-lg border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/10"
              >
                <span className="inline-flex rounded-lg bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase text-emerald-200">
                  {benefit.label}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-white">{benefit.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{benefit.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a className="btn bg-white text-slate-950 hover:bg-emerald-200" href="/baixar-musicas#escolha-seu-pack">
              Quero meu pack organizado
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
