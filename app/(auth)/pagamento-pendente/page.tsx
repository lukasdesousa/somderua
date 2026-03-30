import { Suspense } from "react";
import type { Metadata } from "next";
import PendingPaymentPage from "@/components/pending-payment";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Pagamento pendente",
  description: "Status de pagamento pendente do pedido.",
  path: "/pagamento-pendente",
  noIndex: true,
});

export default function PendingPayment() {
  return (
    <Suspense>
      <PendingPaymentPage />
    </Suspense>
  );
}
