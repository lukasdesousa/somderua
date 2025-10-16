export const metadata: Metadata = {
  title: "Comprar repertório de músicas — +16GB de músicas para pen drive",
  description: "Adquira o pack completo de músicas para paredão e pen drive. Pagamento seguro e download imediato.",
  openGraph: {
    title: "Pack de músicas Som de Rua",
    description: "Mais de 4500 faixas prontas para paredão — baixe agora.",
    url: "https://somderua.com.br/formulario",
    images: [
      {
        url: "https://somderua.com.br/images/pack-16gb-4500.png",
        width: 1200,
        height: 630,
        alt: "Som de Rua repertório de músicas"
      }
    ]
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

import Form from "@/components/form";
import { Metadata, Viewport } from "next";

export default function UserForm() {
  return (
    <Form />
  );
}