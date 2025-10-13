import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Formulário de Compra | Som de Rua",
    description:
        "Preencha o formulário para comprar o pack de músicas para pen drive e paredão — +16GB, 4500+ faixas. Receba o download imediatamente após o pagamento.",
    metadataBase: new URL("https://somderua.com.br"),
    alternates: {
        canonical: "https://somderua.com.br/formulario",
    },
    openGraph: {
        title: "Formulário de Compra | Som de Rua",
        description:
            "Preencha o formulário para comprar o pack de músicas para pen drive e paredão — +16GB, 4500+ músicas.",
        url: "https://somderua.com.br/formulario",
        siteName: "Som de Rua",
        images: [
            {
                url: "https://somderua.com.br/images/og-image.png",
                width: 1200,
                height: 630,
                alt: "Som de Rua — Pack 16GB, 4500+ músicas",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Formulário de Compra | Som de Rua",
        description:
            "Preencha o formulário para acessar o download do pack de músicas após pagamento.",
        images: ["https://somderua.com.br/images/og-image.png"],
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
};

export default function FormularioLayout({ children }: { children: React.ReactNode }) {
    return (
            <main className="relative flex grow flex-col">
                {children}
            </main>
    );
}
