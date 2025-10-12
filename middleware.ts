import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookies = request.cookies;

  const response = NextResponse.next();

  if (pathname === '/download') {
    const token = cookies.get('success_token');
    if (!token?.value) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (pathname === '/pagamento-pendente') {
    const token = cookies.get('pending_token');
    if (!token?.value) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (pathname === '/pagamento-recusado') {
    const token = cookies.get('failure_token');
    if (!token?.value) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/failure', '/pagamento-pendente'],
};
