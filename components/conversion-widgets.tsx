"use client";

import { useEffect, useState } from "react";

export default function ConversionWidgets() {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [buyerName, setBuyerName] = useState("João");

  useEffect(() => {
    const names = ["João", "Matheus", "Larissa", "Carlos", "Bruna"];
    let pointerLeft = false;

    const onMouseOut = (event: MouseEvent) => {
      if (pointerLeft || event.clientY > 10) return;
      pointerLeft = true;
      setShowExitPopup(true);
    };

    const interval = setInterval(() => {
      setBuyerName(names[Math.floor(Math.random() * names.length)]);
    }, 7000);

    window.addEventListener("mouseout", onMouseOut);
    return () => {
      clearInterval(interval);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-4 left-4 z-40 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-4 py-2 text-xs text-emerald-100 shadow-lg">
        {buyerName} acabou de comprar
      </div>

      {showExitPopup && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-indigo-500/40 bg-gray-950 p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-100">Espera! leva com desconto maior agora</h3>
            <p className="mt-2 text-sm text-indigo-100/75">Garanta seu pack atualizado com acesso imediato.</p>
            <div className="mt-5 flex justify-center gap-3">
              <a href="/formulario" className="btn bg-linear-to-t from-indigo-600 to-indigo-500 text-white">Quero desconto</a>
              <button onClick={() => setShowExitPopup(false)} className="btn bg-gray-800 text-gray-200">Continuar no site</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
