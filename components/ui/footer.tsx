import Image from "next/image";
import Link from "next/link";
import FooterIllustration from "@/public/images/footer-illustration.svg";

const productLinks = [
  { href: "/musicas-para-pen-drive", label: "Músicas para pen drive" },
  { href: "/musicas-para-paredao", label: "Músicas para paredão" },
  { href: "/baixar-musicas", label: "Baixar músicas para carro" },
  { href: "/blog", label: "Guias e dicas" },
];

export default function Footer() {
  return (
    <footer>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2"
          aria-hidden="true"
        >
          <Image
            className="max-w-none"
            src={FooterIllustration}
            width={1076}
            height={378}
            alt=""
          />
        </div>
        <div className="grid grid-cols-2 justify-between gap-12 py-8 sm:grid-rows-[auto_auto] md:grid-cols-4 md:grid-rows-[auto_auto] md:py-12 lg:grid-cols-[repeat(4,minmax(0,160px))_1fr] lg:grid-rows-1 xl:gap-20">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Repertórios</h3>
            <ul className="space-y-2 text-sm">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link className="text-indigo-200/65 transition hover:text-indigo-500" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Comprar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-indigo-200/65 transition hover:text-indigo-500" href="/formulario">
                  Comprar pack completo
                </Link>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="mailto:somderua.suporte@gmail.com"
                >
                  Tirar dúvidas
                </a>
              </li>
              <li>
                <Link className="text-indigo-200/65 transition hover:text-indigo-500" href="/">
                  Ver prévia do pack
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="mailto:somderua.suporte@gmail.com"
                >
                  Entrar em contato
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="mailto:somderua.suporte@gmail.com"
                >
                  Enviar avaliação
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
