import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter (resets on serverless cold start — good enough for Netlify)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/itinerary/generate": { max: 5, windowMs: 60_000 },   // 5 per minute
  "/api/places/photos":      { max: 30, windowMs: 60_000 },  // 30 per minute
  "/api/places/search":      { max: 60, windowMs: 60_000 },  // 60 per minute
  "/api/reels":              { max: 10, windowMs: 60_000 },  // 10 per minute
};

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply to API routes with defined limits
  const limit = Object.entries(RATE_LIMITS).find(([path]) =>
    pathname.startsWith(path)
  );

  if (limit) {
    const [, { max, windowMs }] = limit;
    const ip = getIp(req);
    const key = `${ip}:${pathname}`;
    const now = Date.now();

    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      entry.count++;
      if (entry.count > max) {
        return new NextResponse(
          JSON.stringify({ error: "Too many requests. Please slow down." }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)),
            },
          }
        );
      }
    }
  }

  // Security headers on all responses
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
