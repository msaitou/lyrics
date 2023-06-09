import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/index", "/memories/edit", "/memories/chord-list"],
};

const { BASIC_USER, BASIC_PASS } = process.env;

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    if (user === BASIC_USER && pwd === BASIC_PASS) {
      return NextResponse.next();
    }
  }
  url.pathname = "/api/auth";

  return NextResponse.rewrite(url);
}
