'use client';

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function DownloadHome() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  useEffect(() => {
    if (!reference) return router.replace("/formulario");

    // Função async interna
    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(`/api/mercado-pago/payment-status?reference=${reference}`);
        const data = await res.json();

        console.log(data)

        // Se não aprovado, redireciona
        if (!data?.status || data?.status === "not_found") {
          router.replace("/formulario");
        }
      } catch (err) {
        console.error("Erro ao verificar pagamento:", err);
        router.replace("/formulario");
      }
    };

    // Chama a função async
    if (reference) checkPaymentStatus();
  }, [reference, router]);


  async function getDownloadUrl(file: string) {
    const res = await fetch(`/api/download?file=${encodeURIComponent(file)}`);
    const data = await res.json();
    if (data.url) {
      return data.url;
    } else {
      throw new Error(data.error || "Não foi possível gerar URL");
    }
  }

  async function handleDownload() {
    try {
      const url = await getDownloadUrl("16gb-musicas-somderua.zip");
      window.location.href = url;
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <h1
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
              data-aos="fade-up"
            >
              Muito obrigado por sua compra
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-indigo-200/65"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                Clique no botão de download logo abaixo para começar a instalar o seu pack de músicas.
              </p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <div data-aos="fade-up" data-aos-delay={400}>
                  <a
                    className="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto" style={{ cursor: 'pointer' }} onClick={() => handleDownload()}
                  >
                    <span className="relative inline-flex items-center">
                      Download
                      <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
