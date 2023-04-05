import { NextRequest, NextResponse } from "next/server";

const allowed = ["http://localhost:3000", "http://localhost:3001"];

const allowedProd = ["https://app.cryptea.me", "https://cryptea.me"];

export function middleware(req: NextRequest) {

    console.log(req.headers.get("host"), req.ip);

    let ip = req.ip ?? req.headers.get("x-real-ip");

    const forwarded = req.headers.get("x-forwarded-for");

    if (!ip && forwarded) {

        ip = forwarded.split(',').at(0) ?? 'unknown';

    }

  const origin = req.headers.get("origin") || "";

  const isProd = process.env.NODE_ENV === "production";

  const allowedOrigins = isProd ? allowedProd : allowed;



    // if (allowedOrigins.includes(origin)) {
        return NextResponse.next();
    // }

    // return NextResponse.rewrite(new URL("/api/404", req.url));

}

export const config = {
  matcher: [
    "/api/:path*",
    "/api/:path*/:path*",
    "/api/:path*/:path*/:path*",
    "/api/:path*/:path*/:path*/:path*",
    "/api/:path*/:path*/:path*/:path*/:path*",
    "/api/:path*/:path*/:path*/:path*/:path*/:path*",
  ],
};
