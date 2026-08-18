'use client';

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trackOfferEvent } from "@/lib/analytics";
import { digitalProduct } from "@/lib/pricing";

export default function DownloadHome() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const mercadoPagoPaymentId = searchParams.get("payment_id") ?? searchParams.get("collection_id");

  useEffect(() => {
    if (!reference) return router.replace("/baixar-musicas#escolha-seu-pack");

    const checkPaymentStatus = async () => {
      try {
        const params = new URLSearchParams({ reference });

        if (mercadoPagoPaymentId) {
          params.set("payment_id", mercadoPagoPaymentId);
        }

        const res = await fetch(`/api/mercado-pago/payment-status?${params.toString()}`);
        const data = await res.json();

        if (!data?.status || data?.status === "not_found") {
          router.replace("/baixar-musicas#escolha-seu-pack");
          return;
        }

        if (data.offer) {
          const purchaseKey = `purchase_tracked_${reference}`;

          if (!localStorage.getItem(purchaseKey)) {
            trackOfferEvent("purchase", {
              analyticsName: data.offer.name,
              price: data.offer.price,
              priceCents: data.offer.priceCents,
              productId: data.offer.productId,
            });
            localStorage.setItem(purchaseKey, "1");
          }
        }
      } catch (err) {
        console.error("Erro ao verificar pagamento:", err);
        router.replace("/baixar-musicas#escolha-seu-pack");
      }
    };

    if (reference) checkPaymentStatus();
  }, [reference, mercadoPagoPaymentId, router]);


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
      const url = await getDownloadUrl(digitalProduct.deliveryFile);
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
                  <button
                    type="button"
                    className="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                    onClick={() => handleDownload()}
                  >
                    <span className="relative inline-flex items-center">
                      Download
                      <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
