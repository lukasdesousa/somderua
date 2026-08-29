'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trackOfferEvent } from "@/lib/analytics";
import { digitalProduct } from "@/lib/pricing";

type PaymentStatusResponse = {
  status: boolean | "not_found" | "missing_reference";
  paymentStatus?: string | null;
  error?: string;
  offer?: {
    name: "essencial" | "completo";
    price: number;
    priceCents: number;
    productId: typeof digitalProduct.id;
  } | null;
};

type DownloadState = "checking" | "approved" | "error";

const MAX_STATUS_RETRIES = 4;
const STATUS_RETRY_DELAYS_MS = [1500, 3000, 5000, 5000] as const;

export default function DownloadHome() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const accessToken = searchParams.get("access_token");
  const mercadoPagoPaymentId = searchParams.get("payment_id") ?? searchParams.get("collection_id");
  const [downloadState, setDownloadState] = useState<DownloadState>("checking");
  const [statusMessage, setStatusMessage] = useState("Verificando pagamento...");
  const [verificationAttempt, setVerificationAttempt] = useState(0);

  useEffect(() => {
    if (!reference) return router.replace("/baixar-musicas#escolha-seu-pack");

    let cancelled = false;
    let retryTimeout: ReturnType<typeof setTimeout> | undefined;

    const checkPaymentStatus = async (retryCount = 0) => {
      try {
        setDownloadState("checking");
        setStatusMessage(
          retryCount === 0
            ? "Verificando pagamento..."
            : "A confirmação está levando alguns segundos. Tentando novamente automaticamente...",
        );

        const params = new URLSearchParams({ reference });

        if (mercadoPagoPaymentId) {
          params.set("payment_id", mercadoPagoPaymentId);
        }
        if (accessToken) {
          params.set("access_token", accessToken);
        }

        const res = await fetch(`/api/mercado-pago/payment-status?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await readJsonResponse<PaymentStatusResponse>(res);

        if (cancelled) return;

        if (data.status === "not_found" || data.status === "missing_reference") {
          router.replace("/baixar-musicas#escolha-seu-pack");
          return;
        }

        if (isRejectedPaymentStatus(data.paymentStatus)) {
          router.replace(`/pagamento-recusado?external_reference=${reference}&status=${data.paymentStatus}`);
          return;
        }

        if (data.status !== true) {
          const pendingParams = new URLSearchParams({ external_reference: reference });

          if (mercadoPagoPaymentId) {
            pendingParams.set("payment_id", mercadoPagoPaymentId);
          }

          router.replace(`/pagamento-pendente?${pendingParams.toString()}`);
          return;
        }

        setDownloadState("approved");
        setStatusMessage("Pagamento aprovado. Seu download está liberado.");

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
        if (cancelled) return;

        console.error("Erro ao verificar pagamento:", err);

        if (retryCount < MAX_STATUS_RETRIES) {
          const retryDelay = STATUS_RETRY_DELAYS_MS[retryCount] ?? 5000;
          setDownloadState("checking");
          setStatusMessage("Ainda estamos confirmando seu pagamento. A verificação será repetida automaticamente...");
          retryTimeout = setTimeout(() => {
            void checkPaymentStatus(retryCount + 1);
          }, retryDelay);
          return;
        }

        setDownloadState("error");
        setStatusMessage("Não foi possível confirmar o pagamento agora. Tente verificar novamente abaixo.");
      }
    };

    if (reference) void checkPaymentStatus();

    return () => {
      cancelled = true;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [reference, accessToken, mercadoPagoPaymentId, router, verificationAttempt]);


  async function getDownloadUrl(file: string) {
    if (!reference) {
      throw new Error("Pedido não informado");
    }

    const params = new URLSearchParams({ reference, file });
    if (accessToken) {
      params.set("access_token", accessToken);
    }
    const res = await fetch(`/api/download?${params.toString()}`);
    const data = await readJsonResponse<{ url?: string; error?: string }>(res);

    if (data.url) {
      return data.url;
    }

    throw new Error(data.error || "Não foi possível gerar URL");
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
              <p className="mb-8 text-xl text-indigo-200/65" data-aos="fade-up" data-aos-delay={200}>
                {statusMessage}
              </p>

              {downloadState === "approved" ? (
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
              ) : null}

              {downloadState === "error" ? (
                <button
                  type="button"
                  className="btn border border-indigo-400/30 bg-indigo-500/10 text-indigo-100 hover:bg-indigo-500/20"
                  onClick={() => setVerificationAttempt((attempt) => attempt + 1)}
                >
                  Verificar pagamento novamente
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const body = await response.text();
  const data = body ? JSON.parse(body) : null;

  if (!response.ok) {
    throw new Error(data?.error || `HTTP ${response.status}`);
  }

  return data as T;
}

function isRejectedPaymentStatus(status?: string | null): boolean {
  return Boolean(status && ["cancelled", "rejected", "expired", "refunded", "chargeback", "charged_back"].includes(status));
}
