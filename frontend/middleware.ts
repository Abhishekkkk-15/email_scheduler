import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // middleware logic here
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/workflow/:path*"],
};
