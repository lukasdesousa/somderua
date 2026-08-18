// hooks/useMercadoPago.ts
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useEffect } from "react";

type MercadoPagoCheckoutData = {
  userEmail: string;
  name: string;
  offerId: string;
};

const useMercadoPago = () => {
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);
  }, []);

  async function createMercadoPagoCheckout(checkoutData: MercadoPagoCheckoutData) {
    try {
      const res = await fetch("/api/mercado-pago/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      if (!res.ok) throw new Error("Erro ao criar checkout");
      const data = await res.json();

      const url = data.init_point || data.initPoint;
      if (!url) throw new Error("URL de checkout não retornada");

      window.location.href = url;
    } catch (err) {
      console.error("Ocorreu um erro", err);
      // aqui você pode notificar o usuário
    }
  }

  return { createMercadoPagoCheckout };
};

export default useMercadoPago;
