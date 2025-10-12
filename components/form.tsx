'use client'

import { useEffect, useReducer, useState } from "react";
import useMercadoPago from "@/hooks/useMercadoPago";
import { v4 as uuidv4 } from "uuid";

export default function Form() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { createMercadoPagoCheckout } = useMercadoPago();

  const onFinish = async (e: any) => {
    e.preventDefault();
    setLoading(true)

    localStorage.setItem('user_name', name);
    localStorage.setItem('user_email', email);

    await createMercadoPagoCheckout({ userEmail: email, name: name });
    setLoading(false)
  }

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    const name = localStorage.getItem('user_name');

    if(email || name) {
      setEmail(email!)
      setName(name!)
    }
  }, [])

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Formulário de compra
            </h1>
          </div>
          {/* Contact form */}
          <form className="mx-auto max-w-[400px]" onSubmit={onFinish}>
            <div className="space-y-5">
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-indigo-200/65"
                  htmlFor="name"
                >
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-input w-full"
                  placeholder="Seu nome completo"
                  onChange={(e) => setName(e.currentTarget.value)}
                  value={name}
                  required
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-indigo-200/65"
                  htmlFor="email"
                >
                  O seu melhor e-mail <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input w-full"
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  value={email}
                  placeholder="Seu e-mail"
                />
              </div>
            </div>
            <div className="mt-6 space-y-5">
              <button className="btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]" style={{opacity: loading ? 0.5 : 1}}>
                Ir para o checkout
              </button>
            </div>
          </form>
        </div>
        <div className="pb-10 text-center">
          <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
            Powered by <br />
            Mercado Pago
          </h1>
        </div>
      </div>
    </section>
  );
}