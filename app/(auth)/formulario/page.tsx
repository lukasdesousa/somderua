import type { Metadata, Viewport } from "next";
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
  return <Form />;
}
