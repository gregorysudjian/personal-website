import { NextResponse, type NextRequest } from "next/server";

/* Visitors landing on "/" get the language their browser asks for first. */
export function proxy(request: NextRequest) {
  const preferred = request.headers.get("accept-language")?.split(",")[0]?.trim().toLowerCase() ?? "";
  const locale = preferred.startsWith("fr") ? "fr" : "en";
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {
  matcher: "/",
};
