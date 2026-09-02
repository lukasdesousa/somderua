"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import useMercadoPago, {
  CheckoutApiError,
  type MercadoPagoPixCheckoutResponse,
} from "@/hooks/useMercadoPago";
import { trackOfferEvent } from "@/lib/analytics";
import { digitalProduct, getPackOffer } from "@/lib/pricing";

const checkoutTrustHooks = [
  "Pagamento PIX processado com segurança pelo Mercado Pago",
  "Confirmação imediata",
  "Entrega automática somente após a confirmação",
  "Suporte por e-mail para dúvidas de acesso",
];

const POLL_INTERVAL_MS = 6_000;
const MAX_POLL_DURATION_MS = 30 * 60 * 1000;

type CheckoutStage = "idle" | "creating" | "pending" | "approved" | "rejected" | "expired" | "error";

type ActiveOrder = {
  orderId: string;
  offerId: string;
};

type PixData = {
  qrCode: string;
  qrCodeBase64: string;
  expiresAt: string | null;
};

type PaymentStatusResponse = {
  status: boolean | "not_found" | "missing_reference";
  orderStatus?: string;
  statusDetail?: string | null;
  expiresAt?: string | null;
  pix?: {
    qrCode: string;
    qrCodeBase64: string;
  } | null;
};

export default function Form() {
  const searchParams = useSearchParams();
  const selectedOffer = getPackOffer(searchParams.get("offer"));
  const storageKeys = useMemo(() => ({
    activeOrder: `somderua_pix_order_${selectedOffer.id}`,
    checkoutId: `somderua_pix_checkout_id_${selectedOffer.id}`,
  }), [selectedOffer.id]);
  const [stage, setStage] = useState<CheckoutStage>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [pix, setPix] = useState<PixData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copiar código Pix");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const { createMercadoPagoPix } = useMercadoPago();

  useEffect(() => {
    setEmail(localStorage.getItem("user_email") || "");
    setName(localStorage.getItem("user_name") || "");

    const restoredOrder = readStoredOrder(localStorage.getItem(storageKeys.activeOrder), selectedOffer.id);
    setActiveOrder(restoredOrder);
    setPix(null);
    if (restoredOrder) {
      setStage("pending");
    } else {
      setStage("idle");
    }
  }, [selectedOffer.id, storageKeys.activeOrder]);

  useEffect(() => {
    if (!activeOrder || stage !== "pending") return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const startedAt = Date.now();
    let includePix = pix === null;

    const checkStatus = async () => {
      try {
        const params = new URLSearchParams({
          reference: activeOrder.orderId,
        });
        if (includePix) params.set("include_pix", "1");

        const response = await fetch(`/api/mercado-pago/payment-status?${params.toString()}`, {
          cache: "no-store",
        });

        if (response.status === 403) {
          clearStoredOrder(storageKeys);
          setActiveOrder(null);
          setPix(null);
          setStage("idle");
          return;
        }

        const data = await readJsonResponse<PaymentStatusResponse>(response);

        if (cancelled) return;

        if (data.status === "not_found" || data.status === "missing_reference") {
          clearStoredOrder(storageKeys);
          setActiveOrder(null);
          setPix(null);
          setStage("idle");
          return;
        }

        if (data.pix) {
          setPix({
            qrCode: data.pix.qrCode,
            qrCodeBase64: data.pix.qrCodeBase64,
            expiresAt: data.expiresAt ?? null,
          });
          includePix = false;
        }

        if (data.status === true || data.orderStatus === "APPROVED") {
          setStage("approved");
          localStorage.removeItem(storageKeys.checkoutId);
          trackPurchaseOnce(activeOrder.orderId, selectedOffer);
          return;
        }

        if (data.orderStatus === "EXPIRED" || hasExpired(data.expiresAt)) {
          setStage("expired");
          clearStoredOrder(storageKeys);
          return;
        }

        if (["REJECTED", "CANCELLED", "REFUNDED", "CHARGEBACK"].includes(data.orderStatus ?? "")) {
          setStage("rejected");
          clearStoredOrder(storageKeys);
          return;
        }

        if (Date.now() - startedAt >= MAX_POLL_DURATION_MS) {
          setErrorMessage("O pagamento continua pendente. Você pode verificar novamente sem gerar outra cobrança.");
          setStage("error");
          return;
        }

        timeout = setTimeout(() => void checkStatus(), POLL_INTERVAL_MS);
      } catch (error) {
        if (cancelled) return;
        console.error("Falha temporária ao consultar o pagamento", {
          errorName: error instanceof Error ? error.name : "UnknownError",
        });
        timeout = setTimeout(() => void checkStatus(), POLL_INTERVAL_MS);
      }
    };

    void checkStatus();

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [activeOrder, pix, selectedOffer, stage, storageKeys]);

  const onFinish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (stage === "creating") return;

    setStage("creating");
    setErrorMessage(null);
    localStorage.setItem("user_name", name);
    localStorage.setItem("user_email", email);
    trackOfferEvent("begin_checkout", selectedOffer, { source: "checkout_form_pix" });

    const checkoutId = getOrCreateCheckoutId(storageKeys.checkoutId);

    try {
      const data = await createMercadoPagoPix({
        checkoutId,
        userEmail: email,
        name,
        cpf,
        offerId: selectedOffer.id,
      });
      const order = {
        orderId: data.orderId,
        offerId: selectedOffer.id,
      };

      localStorage.setItem(storageKeys.activeOrder, JSON.stringify(order));
      setActiveOrder(order);
      setPix(toPixData(data));
      applyProviderStatus(data.status, data.expiresAt);
    } catch (error) {
      const message = error instanceof CheckoutApiError
        ? error.message
        : "Não foi possível gerar o Pix. Tente novamente.";
      setErrorMessage(message);
      setStage("error");
    }
  };

  function applyProviderStatus(orderStatus: string, expiresAt: string | null) {
    if (orderStatus === "APPROVED") {
      setStage("approved");
      return;
    }
    if (orderStatus === "EXPIRED" || hasExpired(expiresAt)) {
      setStage("expired");
      return;
    }
    if (["REJECTED", "CANCELLED", "REFUNDED", "CHARGEBACK"].includes(orderStatus)) {
      setStage("rejected");
      return;
    }
    setStage("pending");
  }

  async function copyPixCode() {
    if (!pix?.qrCode) return;

    try {
      await navigator.clipboard.writeText(pix.qrCode);
      setCopyLabel("Código copiado!");
      window.setTimeout(() => setCopyLabel("Copiar código Pix"), 2500);
    } catch {
      setCopyLabel("Selecione e copie o código abaixo");
    }
  }

  async function handleDownload() {
    if (!activeOrder || downloadLoading) return;
    setDownloadLoading(true);
    setErrorMessage(null);

    try {
      const params = new URLSearchParams({
        reference: activeOrder.orderId,
      });
      const response = await fetch(`/api/download?${params.toString()}`, { cache: "no-store" });
      const data = await readJsonResponse<{ url?: string; error?: string }>(response);
      if (!data.url) throw new Error(data.error || "URL de download indisponível");
      window.location.assign(data.url);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Pagamento confirmado, mas o download não pôde ser aberto. Tente novamente.",
      );
    } finally {
      setDownloadLoading(false);
    }
  }

  function startAnotherPix() {
    clearStoredOrder(storageKeys);
    setActiveOrder(null);
    setPix(null);
    setCpf("");
    setErrorMessage(null);
    setStage("idle");
  }

  const showForm = !activeOrder && ["idle", "creating", "error"].includes(stage);

  return (
    <section aria-labelledby="checkout-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <CheckoutHeader offer={selectedOffer} />

          {showForm ? (
            <form className="mx-auto max-w-[500px] rounded-2xl border border-gray-800 bg-gray-900/40 p-5 shadow-[0_0_30px_rgba(99,102,241,0.12)]" onSubmit={onFinish}>
              <OrderSummary offer={selectedOffer} />

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-indigo-100/80" htmlFor="email">
                    Seu melhor e-mail <span className="text-red-500">*</span>
                  </label>
                  <input id="email" type="email" className="form-input w-full" onChange={(event) => setEmail(event.currentTarget.value)} value={email} placeholder="voce@email.com" autoComplete="email" maxLength={254} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-indigo-100/80" htmlFor="name">
                    Nome completo <span className="text-red-500">*</span>
                  </label>
                  <input id="name" type="text" className="form-input w-full" placeholder="Seu nome" onChange={(event) => setName(event.currentTarget.value)} value={name} autoComplete="name" maxLength={120} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-indigo-100/80" htmlFor="cpf">
                    CPF <span className="text-red-500">*</span>
                  </label>
                  <input id="cpf" type="text" inputMode="numeric" className="form-input w-full" placeholder="000.000.000-00" onChange={(event) => setCpf(formatCpf(event.currentTarget.value))} value={cpf} autoComplete="off" maxLength={14} required />
                  <p className="mt-1 text-xs text-indigo-100/50">Usado somente pelo Mercado Pago para emitir o Pix, não salvamos o CPF.</p>
                </div>
              </div>

              <ul className="mt-5 space-y-2 rounded-xl border border-gray-800 bg-gray-950/60 p-4 text-sm text-indigo-100/80" aria-label="Segurança e entrega do checkout">
                {checkoutTrustHooks.map((hook) => (
                  <li key={hook} className="flex gap-2"><span aria-hidden="true">✓</span><span>{hook}</span></li>
                ))}
              </ul>

              {errorMessage ? <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{errorMessage}</p> : null}

              <div className="mt-6">
                <button disabled={stage === "creating"} className="btn w-full bg-linear-to-t from-emerald-600 to-emerald-500 text-white disabled:cursor-not-allowed disabled:opacity-60" aria-label={`Gerar Pix de ${selectedOffer.priceLabel}`}>
                  {stage === "creating" ? "Gerando QR CODE..." : `Gerar Pix de ${selectedOffer.priceLabel}`}
                </button>
                <p className="mt-3 text-center text-xs text-indigo-100/60">O QR Code será exibido aqui, sem sair do site.</p>
              </div>
            </form>
          ) : null}

          {activeOrder ? (
            <div className="mx-auto max-w-[560px] rounded-2xl border border-gray-800 bg-gray-900/50 p-5 text-center shadow-[0_0_30px_rgba(16,185,129,0.12)] sm:p-7">
              {stage === "approved" ? (
                <>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-3xl text-emerald-300" aria-hidden="true">✓</div>
                  <h2 className="mt-4 text-2xl font-semibold text-white">Pagamento confirmado</h2>
                  <p className="mt-2 text-indigo-100/70">Seu pagamento foi confirmado, seu download foi liberado.</p>
                  {errorMessage ? <p role="alert" className="mt-4 text-sm text-red-200">{errorMessage}</p> : null}
                  <button type="button" onClick={() => void handleDownload()} disabled={downloadLoading} className="btn mt-6 w-full bg-linear-to-t from-emerald-500 to-lime-400 font-bold text-slate-950 disabled:opacity-60">
                    {downloadLoading ? "Preparando download..." : "Baixar pelo navegador"}
                  </button>
                </>
              ) : null}

              {stage === "pending" ? (
                <>
                  <h2 className="text-2xl font-semibold text-white">Pague com Pix</h2>
                  <p className="mt-2 text-indigo-100/70">Escaneie o QR Code com o aplicativo do seu banco.</p>
                  {pix?.qrCodeBase64 ? (
                    <Image unoptimized src={`data:image/png;base64,${pix.qrCodeBase64}`} width={280} height={280} alt="QR Code Pix desta compra" className="mx-auto mt-5 rounded-xl bg-white p-3" />
                  ) : (
                    <div className="mx-auto mt-6 h-10 w-10 animate-spin rounded-full border-4 border-indigo-300/20 border-t-indigo-300" aria-label="Carregando dados do Pix" />
                  )}
                  {pix?.qrCode ? (
                    <>
                      <label htmlFor="pix-code" className="mt-5 block text-sm font-medium text-indigo-100/80">Pix Copia e Cola</label>
                      <textarea id="pix-code" value={pix.qrCode} readOnly rows={4} className="form-input mt-2 w-full resize-none break-all text-xs" onFocus={(event) => event.currentTarget.select()} />
                      <button type="button" onClick={() => void copyPixCode()} className="btn mt-3 w-full border border-indigo-400/30 bg-indigo-500/10 text-indigo-100 hover:bg-indigo-500/20">{copyLabel}</button>
                    </>
                  ) : null}
                  <div className="mt-5 flex items-center justify-center gap-2 text-sm text-amber-200" role="status">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-amber-300" aria-hidden="true" />
                    Aguardando pagamento...
                  </div>
                  {pix?.expiresAt ? <p className="mt-2 text-xs text-indigo-100/50">Pix válido até {formatExpiration(pix.expiresAt)}.</p> : null}
                  <p className="mt-3 text-xs text-indigo-100/50">Pedido {activeOrder.orderId.slice(0, 8)}. A tela atualizará automaticamente.</p>
                </>
              ) : null}

              {stage === "expired" || stage === "rejected" ? (
                <>
                  <h2 className="text-2xl font-semibold text-white">{stage === "expired" ? "Este Pix expirou" : "Pagamento não concluído"}</h2>
                  <p className="mt-3 text-indigo-100/70">Nenhum produto foi liberado. Gere uma nova cobrança para tentar novamente.</p>
                  <button type="button" onClick={startAnotherPix} className="btn mt-6 w-full bg-linear-to-t from-indigo-600 to-indigo-500 text-white">Gerar novo Pix</button>
                </>
              ) : null}

              {stage === "error" ? (
                <>
                  <h2 className="text-2xl font-semibold text-white">Não foi possível atualizar agora</h2>
                  <p role="alert" className="mt-3 text-indigo-100/70">{errorMessage ?? "Tente verificar o mesmo pedido novamente."}</p>
                  <button type="button" onClick={() => setStage("pending")} className="btn mt-6 w-full border border-indigo-400/30 bg-indigo-500/10 text-indigo-100">Verificar novamente</button>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function CheckoutHeader({ offer }: { offer: ReturnType<typeof getPackOffer> }) {
  return (
    <div className="pb-10 text-center">
      <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">Oferta escolhida: {offer.name}</p>
      <h1 id="checkout-title" className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">Checkout Rápido</h1>
      <div className="mt-4" aria-label="Resumo da oferta escolhida">
        {offer.originalPriceLabel ? <p className="text-sm text-indigo-100/55">De <span className="line-through">{offer.originalPriceLabel}</span> por</p> : null}
        <p className="text-3xl font-semibold text-indigo-100">{offer.priceLabel}</p>
        {offer.promotionLabel ? <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.14em] text-amber-300">{offer.promotionLabel} · {offer.discountLabel}</p> : null}
        <p className="mt-1 text-sm text-indigo-100/70">{offer.description}</p>
      </div>
    </div>
  );
}

function OrderSummary({ offer }: { offer: ReturnType<typeof getPackOffer> }) {
  return (
    <div className="mb-5 rounded-xl border border-indigo-500/20 bg-gray-950/70 p-4">
      <h2 className="text-base font-semibold text-gray-100">Resumo do pedido</h2>
      <div className="mt-3 flex items-start justify-between gap-4 text-sm">
        <div><p className="font-medium text-indigo-100">{offer.name}</p><p className="text-indigo-100/65">{digitalProduct.checkoutName}</p><p className="mt-1 text-indigo-100/65">Conteúdo digital liberado conforme a oferta escolhida.</p></div>
        <div className="shrink-0 text-right">{offer.originalPriceLabel ? <p className="text-xs text-indigo-100/45 line-through">{offer.originalPriceLabel}</p> : null}<p className="font-semibold text-emerald-300">{offer.priceLabel}</p></div>
      </div>
    </div>
  );
}

function getOrCreateCheckoutId(storageKey: string): string {
  const existing = localStorage.getItem(storageKey);
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;

  const checkoutId = crypto.randomUUID();
  localStorage.setItem(storageKey, checkoutId);
  return checkoutId;
}

function readStoredOrder(value: string | null, expectedOfferId: string): ActiveOrder | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    const order = parsed as Record<string, unknown>;

    if (
      typeof order.orderId === "string"
      && order.offerId === expectedOfferId
    ) {
      return { orderId: order.orderId, offerId: expectedOfferId };
    }
  } catch {
    return null;
  }

  return null;
}

function clearStoredOrder(keys: { activeOrder: string; checkoutId: string }) {
  localStorage.removeItem(keys.activeOrder);
  localStorage.removeItem(keys.checkoutId);
}

function toPixData(data: MercadoPagoPixCheckoutResponse): PixData | null {
  return data.qrCode && data.qrCodeBase64
    ? { qrCode: data.qrCode, qrCodeBase64: data.qrCodeBase64, expiresAt: data.expiresAt }
    : null;
}

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function hasExpired(value?: string | null): boolean {
  if (!value) return false;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) && timestamp <= Date.now();
}

function formatExpiration(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "o prazo informado"
    : new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

function trackPurchaseOnce(orderId: string, offer: ReturnType<typeof getPackOffer>) {
  const purchaseKey = `purchase_tracked_${orderId}`;
  if (localStorage.getItem(purchaseKey)) return;
  trackOfferEvent("purchase", offer);
  localStorage.setItem(purchaseKey, "1");
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const body = await response.text();
  const data: unknown = body ? JSON.parse(body) : null;

  if (!response.ok) {
    const message = typeof data === "object" && data !== null && "error" in data
      ? String((data as { error: unknown }).error)
      : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}
