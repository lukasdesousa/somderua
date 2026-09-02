import Link from "next/link";
import Logo from "@/components/ui/logo";
import { offerPriceLabels } from "@/lib/pricing";

const productLinks = [
  { href: "/musicas-para-pen-drive", label: "Musicas para pen drive" },
  { href: "/musicas-para-som-automotivo", label: "Musicas para som automotivo" },
  { href: "/baixar-musicas", label: "Baixar musicas para carro" },
  { href: "/blog", label: "Guias e dicas" },
];

const supportLinks = [
  { href: "/suporte", label: "Central de suporte" },
  { href: "mailto:somderua.suporte@gmail.com", label: "somderua.suporte@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#060811]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-sm font-semibold text-white">Som de Rua</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Packs de musicas para pen drive e carro com entrega automatica, organizacao clara e suporte por e-mail.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Repertorios</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link className="text-slate-400 transition hover:text-emerald-200" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Suporte</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link className="break-all text-slate-400 transition hover:text-emerald-200" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-emerald-200">Escolha seu pack</p>
            <p className="mt-2 text-sm text-slate-400">Básico +13 GB · {offerPriceLabels.entry}</p>
            <p className="font-nacelle text-3xl font-semibold text-white">Premium +26 GB · {offerPriceLabels.recommended}</p>
            <Link className="btn mt-4 w-full bg-white text-slate-950 hover:bg-emerald-200" href="/baixar-musicas#escolha-seu-pack">
              Ver opções
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
