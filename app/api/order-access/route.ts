import { NextRequest, NextResponse } from "next/server";
import {
  getOrderAccessCookieName,
  verifyOrderAccessToken,
} from "@/lib/payments/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");
  const accessToken = request.nextUrl.searchParams.get("access_token");

  if (!reference || !accessToken || !await verifyOrderAccessToken(accessToken, reference)) {
    return NextResponse.json(
      { error: "Acesso não autorizado" },
      {
        status: 403,
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
          "Referrer-Policy": "no-referrer",
        },
      },
    );
  }

  const destination = new URL("/download", request.url);
  destination.searchParams.set("reference", reference);
  const response = NextResponse.redirect(destination);

  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.cookies.set(getOrderAccessCookieName(reference), accessToken, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
