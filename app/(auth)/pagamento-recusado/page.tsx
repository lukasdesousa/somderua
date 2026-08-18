import type { Metadata } from "next";
import { Suspense } from "react";
import FailurePaymentePage from "@/components/failure";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Pagamento recusado",
  description: "Pagamento recusado, revise seus dados e tente novamente.",
  path: "/pagamento-recusado",
  noIndex: true,
});

export default function RejectedPayment() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16 text-center text-indigo-100/70 sm:px-6">Carregando status...</div>}>
      <FailurePaymentePage />
    </Suspense>
  );
}
