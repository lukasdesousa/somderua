import type { Metadata } from "next";
import FailurePaymentePage from "@/components/failure";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Pagamento recusado",
  description: "Pagamento recusado, revise seus dados e tente novamente.",
  path: "/pagamento-recusado",
  noIndex: true,
});

export default function RejectedPayment() {
  return <FailurePaymentePage />;
}
