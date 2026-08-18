"use client";

import Link from "next/link";
import Logo from "./logo";
import { offerPriceLabels } from "@/lib/pricing";

const navItems = [
  { href: "/musicas-para-pen-drive", label: "Pen drive" },
  { href: "/musicas-para-paredao", label: "Paredao" },
  { href: "/baixar-musicas", label: "Baixar musicas" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  return (
    <header className="sticky top-2 z-30 w-full md:top-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex min-h-14 items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-950/90 px-3 py-2 shadow-[0_14px_40px_rgba(0,0,0,0.24)] backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-2">
            <Logo />
            <Link href="/" className="hidden text-sm font-semibold text-white sm:block">
              Som de Rua
            </Link>
          </div>
          <nav aria-label="Navegacao principal" className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/baixar-musicas#escolha-seu-pack"
            className="btn-sm bg-linear-to-t from-emerald-500 to-lime-400 py-[8px] font-bold text-slate-950 hover:from-emerald-400 hover:to-lime-300"
            aria-label="Escolher oferta do Pack Som de Rua"
          >
            Comprar
            <span className="ml-1 hidden sm:inline">{offerPriceLabels.entry}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
