import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Form from "@/components/form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Comprar repertório de músicas para pen drive",
  description:
    "Checkout seguro para adquirir pack de músicas para paredão e pen drive com liberação imediata.",
  path: "/formulario",
  noIndex: true,
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function UserForm() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16 text-center text-indigo-100/70 sm:px-6">Carregando checkout...</div>}>
      <Form />
    </Suspense>
  );
}
