import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ['/:path*'],
  // matcher: ["/", "/index", "/memories/edit", "/memories/chord-list"],
};

const { BASIC_USER, BASIC_PASS } = process.env;

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    // サーバーコンポーネントで現在のhostを取得ための処理
    const requestHeaders = new Headers(req.headers);
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.get("host");
    const origin = `${protocol}://${host}`;
    requestHeaders.set('x-origin', origin);
    requestHeaders.set('x-pathname', req.nextUrl.pathname)
    // console.log(origin);
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    if (user === BASIC_USER && pwd === BASIC_PASS) {
      return NextResponse.next(
        { request: {headers: requestHeaders,}}  // サーバーコンポーネントで現在のhostを取得ための処理
      );
    }
  }
  url.pathname = "/api/auth";

  return NextResponse.rewrite(url);
}
