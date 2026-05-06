"use client";

import Link from "next/link";
import Logo from "./logo";

const navItems = [
  { href: "/musicas-para-pen-drive", label: "Pen drive" },
  { href: "/musicas-para-paredao", label: "Paredão" },
  { href: "/baixar-musicas", label: "Baixar músicas" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 py-2 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-xs">
          <div className="flex flex-1 items-center">
            <Logo />
          </div>
          <nav aria-label="Navegação principal" className="hidden flex-1 items-center justify-end gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="btn-sm bg-gray-800 py-[5px] text-gray-200 hover:bg-gray-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/blog"
            className="btn-sm bg-gray-800 py-[5px] text-gray-200 hover:bg-gray-700 md:hidden"
          >
            Blog
          </Link>
        </div>
      </div>
    </header>
  );
}
