import { auth } from './auth';
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PREFIX_PHOTO, PREFIX_TAG } from './site/paths';

export default function middleware(req: NextRequest, res:NextResponse) {
  const pathname = req.nextUrl.pathname;

  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/photos', req.url));
  } else if (/^\/photos\/(.)+$/.test(pathname)) {
    // Accept /photos/* paths, but serve /p/*
    const matches = pathname.match(/^\/photos\/(.+)$/);
    return NextResponse.rewrite(new URL(
      `${PREFIX_PHOTO}/${matches?.[1]}`,
      req.url,
    ));
  } else if (/^\/t\/(.)+$/.test(pathname)) {
    // Accept /t/* paths, but serve /tag/*
    const matches = pathname.match(/^\/t\/(.+)$/);
    return NextResponse.rewrite(new URL(
      `${PREFIX_TAG}/${matches?.[1]}`,
      req.url,
    ));
  }

  return auth(
    req as unknown as NextApiRequest,
    res as unknown as NextApiResponse,
  );
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
