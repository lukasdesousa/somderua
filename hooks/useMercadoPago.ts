// hooks/useMercadoPago.ts
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useEffect } from "react";

const useMercadoPago = () => {
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);
  }, []);

  async function createMercadoPagoCheckout(checkoutData: unknown) {
    try {
      const res = await fetch("/api/mercado-pago/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      if (!res.ok) throw new Error("Erro ao criar checkout");
      const data = await res.json();

      // **Use o field correto** — ajuste conforme seu endpoint:
      // se você retornou init_point:
      const url = data.init_point || data.initPoint;
      if (!url) throw new Error("URL de checkout não retornada");

      // **Redireciona para o checkout externo**
      window.location.href = url;
    } catch (err) {
      console.error("Ocorreu um erro", err);
      // aqui você pode notificar o usuário
    }
  }

  return { createMercadoPagoCheckout };
};

export default useMercadoPago;
