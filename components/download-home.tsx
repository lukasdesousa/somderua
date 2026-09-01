'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trackOfferEvent } from "@/lib/analytics";
import PremiumDownloadOptions from "@/components/premium-download-options";
import SevenZipExtractionGuide from "@/components/seven-zip-extraction-guide";
import type { DownloadProvider } from "@/lib/downloads";
import { digitalProduct, type PackOfferId } from "@/lib/pricing";

type PaymentStatusResponse = {
  status: boolean | "not_found" | "missing_reference";
  paymentStatus?: string | null;
  error?: string;
  offer?: {
    id?: PackOfferId;
    name: PackOfferId;
    price: number;
    priceCents: number;
    productId: typeof digitalProduct.id;
  } | null;
};

type DownloadState = "checking" | "approved" | "error";

const MAX_STATUS_RETRIES = 4;
const STATUS_RETRY_DELAYS_MS = [1500, 3000, 5000, 5000] as const;
const STATUS_REQUEST_TIMEOUT_MS = 10_000;

export default function DownloadHome() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const queryAccessToken = searchParams.get("access_token");
  const mercadoPagoPaymentId = searchParams.get("payment_id") ?? searchParams.get("collection_id");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accessTokenReady, setAccessTokenReady] = useState(false);
  const [downloadState, setDownloadState] = useState<DownloadState>("checking");
  const [statusMessage, setStatusMessage] = useState("Verificando pagamento...");
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [approvedOfferId, setApprovedOfferId] = useState<PackOfferId | null>(null);
  const [downloadLoading, setDownloadLoading] = useState<DownloadProvider | null>(null);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const fragmentAccessToken = hashParams.get("order_access");

    setAccessToken(queryAccessToken || fragmentAccessToken);
    setAccessTokenReady(true);

    if (fragmentAccessToken) {
      hashParams.delete("order_access");
      const cleanUrl = new URL(window.location.href);
      cleanUrl.hash = hashParams.toString();
      window.history.replaceState(null, "", `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
    }
  }, [queryAccessToken]);

  useEffect(() => {
    if (!reference) return router.replace("/baixar-musicas#escolha-seu-pack");
    if (!accessTokenReady) return;

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

        const res = await fetchWithTimeout(`/api/mercado-pago/payment-status?${params.toString()}`, {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (res.status === 401 || res.status === 403) {
          setDownloadState("error");
          setStatusMessage("Este link de acesso não pôde ser validado. Abra novamente o botão original do e-mail ou fale com o suporte.");
          return;
        }

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
        // Approved legacy orders predate offer IDs and use the existing Premium delivery.
        setApprovedOfferId(data.offer?.id ?? data.offer?.name ?? "completo");
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
  }, [reference, accessToken, accessTokenReady, mercadoPagoPaymentId, router, verificationAttempt]);


  async function getDownloadUrl(file: string, provider: DownloadProvider) {
    if (!reference) {
      throw new Error("Pedido não informado");
    }

    const params = new URLSearchParams({ reference, file, provider });
    if (accessToken) {
      params.set("access_token", accessToken);
    }
    const res = await fetchWithTimeout(`/api/download?${params.toString()}`, {
      cache: "no-store",
      credentials: "same-origin",
    });
    const data = await readJsonResponse<{ url?: string; error?: string }>(res);

    if (data.url) {
      return data.url;
    }

    throw new Error(data.error || "Não foi possível gerar URL");
  }

  async function handleDownload(provider: DownloadProvider) {
    if (downloadLoading) return;

    setDownloadLoading(provider);
    setStatusMessage(
      provider === "google_drive"
        ? "Abrindo o Google Drive..."
        : "Iniciando seu download. Em arquivos grandes, o navegador pode levar alguns segundos...",
    );

    try {
      const url = await getDownloadUrl(digitalProduct.deliveryFile, provider);
      window.location.assign(url);
      setStatusMessage(
        provider === "google_drive"
          ? "Google Drive aberto. Siga as instruções para baixar o pack."
          : "Download iniciado. Verifique os downloads do seu navegador.",
      );
    } catch (err) {
      console.error(err);
      setStatusMessage(err instanceof Error ? err.message : "Não foi possível preparar o download agora.");
    } finally {
      setDownloadLoading(null);
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

              {downloadState === "approved" && approvedOfferId === "completo" ? (
                <div className="mx-auto max-w-2xl" data-aos="fade-up" data-aos-delay={400}>
                  <PremiumDownloadOptions
                    loadingProvider={downloadLoading}
                    onDownload={(provider) => void handleDownload(provider)}
                  />
                  <SevenZipExtractionGuide
                    headingId="seven-zip-download-title"
                    compact
                    premium
                    className="mt-6"
                  />
                </div>
              ) : null}

              {downloadState === "approved" && approvedOfferId !== "completo" ? (
                <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                  <div data-aos="fade-up" data-aos-delay={400}>
                    <button
                      type="button"
                      className="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] disabled:cursor-wait disabled:opacity-75 sm:mb-0 sm:w-auto"
                      onClick={() => void handleDownload("direct")}
                      disabled={downloadLoading !== null}
                      aria-busy={downloadLoading === "direct"}
                    >
                      {downloadLoading === "direct" ? (
                        <span className="relative inline-flex items-center gap-2" role="status">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden="true" />
                          Iniciando download...
                        </span>
                      ) : (
                        <span className="relative inline-flex items-center">
                          Download
                          <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                            -&gt;
                          </span>
                        </span>
                      )}
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

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), STATUS_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
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
