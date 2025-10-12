'use client'

import PendingPaymentPage from "@/components/pending-payment";
import { Suspense } from "react";

export default function UserForm() {
  return (
    <Suspense>
      <PendingPaymentPage />
    </Suspense>
  );
}