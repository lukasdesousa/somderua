// app/api/payment-status/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const payment = await prisma.user_payment.findUnique({
    where: { id: reference },
  });

  if (!payment) {
    return NextResponse.json({ status: "not_found" });
  }

  return NextResponse.json({ status: payment.approved });
}
