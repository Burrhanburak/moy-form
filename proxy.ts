import { NextRequest, NextResponse } from "next/server";

// Basit proxy - sadece routing kontrolü
export default function proxy(req: NextRequest) {
  const { nextUrl } = req;

  // Ana sayfa "/" - direkt signup'a yönlendir
  if (nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  // /dashboard ve altındaki sayfalar için basit kontrol
  if (nextUrl.pathname.startsWith("/dashboard")) {
    // Burada session kontrolü yapılabilir ama şimdilik basit bırakıyoruz
    return NextResponse.next();
  }

  // /onboarding sayfaları için basit kontrol
  if (nextUrl.pathname.startsWith("/onboarding")) {
    return NextResponse.next();
  }

  // Login ve signup sayfaları için basit kontrol
  if (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Next.js config — hangi path'lerde middleware çalışacak
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
