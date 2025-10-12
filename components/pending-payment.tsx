'use client';

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { sendPurchaseEmail } from "@/lib/sendEmail";

export default function PendingPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("external_reference");

  useEffect(() => {
    if (!reference) {
      router.replace("/formulario");
      return;
    }

    let counter = 0; // evita loop infinito
    const interval = setInterval(async () => {
      try {
        if (counter++ > 75) {
          clearInterval(interval); // para após 5 minutos (75 * 4s)
          console.warn("Tempo limite de espera excedido.");
          return;
        }

        const res = await fetch(`/api/mercado-pago/payment-status?reference=${reference}`);
        const data = await res.json();

        console.log("Status do pagamento:", data);

        if (data?.status === true) {
          const email = localStorage.getItem('user_email');
          clearInterval(interval);
          await sendPurchaseEmail(email!, reference)
          router.replace(`/download?reference=${reference}`);
        }
      } catch (error) {
        console.error("Erro ao verificar status do pagamento:", error);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [reference, router]);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="max-w-3xl">
        <h1
          className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text text-transparent pb-5 font-nacelle text-4xl font-semibold md:text-5xl"
        >
          Aguardando confirmação de pagamento
        </h1>
        <p className="text-lg text-indigo-200/65 mb-8">
          Estamos aguardando a confirmação de pagamento. Assim que for aprovado, você será redirecionado automaticamente.
        </p>

        {/* Loader visual */}
        <div className="flex justify-center">
          <svg
            className="animate-spin h-10 w-10 text-indigo-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>

        <p className="mt-6 text-sm text-indigo-300/60">
          Isso pode levar alguns segundos dependendo do método de pagamento.
        </p>
      </div>
    </section>
  );
}
