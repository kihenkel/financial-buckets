import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ACCOUNT_ID_COOKIE = 'accountId';

export function middleware(request: NextRequest) {
  const accountIdCookie = request.cookies.get(ACCOUNT_ID_COOKIE)?.value;
  if (request.nextUrl.pathname === '/' && accountIdCookie) {
    return NextResponse.redirect(new URL(`/accounts/${accountIdCookie}`, request.url));
  }
}