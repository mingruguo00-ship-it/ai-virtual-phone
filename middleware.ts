import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ACCOUNT_GATE_COOKIE, ACCOUNT_SESSION_COOKIE } from "./lib/account-cookie-constants";
import { verifyAccountGateCookieValue } from "./lib/account-gate-cookie";
import { isSelfHostedModeEnabled } from "./lib/self-hosting";

const PUBLIC_ROUTE_PREFIXES = [
  "/verify",
  "/api/auth/",
  "/api/verify/",
];

const STATIC_ROUTE_PREFIXES = [
  "/_next/",
  "/birds/",
  "/diary/",
  "/fonts/",
  "/game-builtins/",
  "/game-covers/",
  "/hdri/",
  "/images/",
  "/models/",
  "/widgets/",
  "/xiaohongshu/",
];

const STATIC_FILE_RE = /\.(?:avif|bin|css|gif|glb|gltf|hdr|ico|jpeg|jpg|js|json|map|mjs|mp3|ogg|otf|png|svg|ttf|txt|wasm|wav|webmanifest|webp|woff|woff2)$/i;

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname === prefix.slice(0, -1) || pathname.startsWith(prefix));
}

function isStaticRoute(pathname: string): boolean {
  return STATIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix)) || STATIC_FILE_RE.test(pathname);
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

function rewriteToHome(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.rewrite(url);
}

export async function middleware(request: NextRequest) {
  // 强制开启单机模式，跳过所有登录验证
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:avif|bin|css|gif|glb|gltf|hdr|ico|jpeg|jpg|js|json|map|mjs|mp3|ogg|otf|png|svg|ttf|txt|wasm|wav|webmanifest|webp|woff|woff2)$).*)",
  ],
};
