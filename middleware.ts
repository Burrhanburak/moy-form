import {
  isMissingUserAgent,
  isSpoofedBot,
  isVerifiedBot,
} from "@arcjet/inspect";
import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

import ip from "@arcjet/ip";
// Arcjet kuralları
const aj = arcjet({
  key: process.env.ARCJET_KEY!, // https://app.arcjet.com'dan alınıyor
  rules: [
    detectBot({
      mode: "LIVE", // LIVE = bloklar, DRY_RUN = sadece loglar
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing gibi arama motorlarına izin ver
        // İstersen açabilirsin:
        //"CATEGORY:MONITOR",  // uptime monitoring botları
        //"CATEGORY:PREVIEW",  // Slack, Discord gibi link preview botları
      ],
    }),
    shield({
      mode: "DRY_RUN",
    }),
  ],
});

// Kendi middleware'in (ör: login kontrolü)
async function customMiddleware(req: NextRequest) {
  const { nextUrl } = req;
  const request = new Request(req.url, {
    headers: req.headers,
  });
  const publicIp = await ip(request);
  console.log("Public IP", publicIp);
  const session = await getSessionCookie(req);
  const isLoggedIn = !!session;

  console.log("🔍 Middleware - Path:", nextUrl.pathname);
  console.log("🔍 Middleware - Session exists:", isLoggedIn);
  console.log("🔍 Middleware - Session data:", session ? "yes" : "no");

  const sessionCheck = await aj.protect(req);
  if (sessionCheck.isDenied()) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  // Allow any verified search engine bot without considering any other signals
  if (sessionCheck.results.some(isVerifiedBot)) {
    return NextResponse.json(
      {
        name: "Hello bot! Here's some SEO optimized response",
      },
      { status: 200 }
    );
  }
  // Block a request if the SDK suggests it
  if (sessionCheck.isDenied()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Block any request without a User-Agent header because we expect all
  // well-behaved clients to have it
  if (sessionCheck.results.some(isMissingUserAgent)) {
    return NextResponse.json({ error: "You are a bot!" }, { status: 400 });
  }

  // Block any client pretending to be a search engine bot but using an IP
  // address that doesn't satisfy the verification
  if (sessionCheck.results.some(isSpoofedBot)) {
    return NextResponse.json(
      { error: "You are pretending to be a good bot!" },
      { status: 403 }
    );
  }
  // Ana sayfa "/" - direkt signup'a yönlendir
  if (nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  // /dashboard ve altındaki sayfalar login gerektiriyor
  if (nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // /onboarding ve altındaki tüm sayfalar login gerektiriyor
  if (nextUrl.pathname.startsWith("/onboarding") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Login ve signup sayfalarına zaten giriş yapmışsa dashboard'a yönlendir
  if (
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup") &&
    isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Next.js config — hangi path’lerde middleware çalışacak
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// ✅ Arcjet + kendi middleware’in birleştirilmiş
export default createMiddleware(aj, customMiddleware);
