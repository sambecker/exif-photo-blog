import { auth } from './src/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  PATH_ADMIN,
  PATH_ADMIN_PHOTOS,
  PATH_OG,
  PATH_OG_SAMPLE,
} from './src/app/path';

export function proxy(req: NextRequest, res:NextResponse) {
  const pathname = req.nextUrl.pathname;

  if (pathname === PATH_ADMIN) {
    return NextResponse.redirect(new URL(PATH_ADMIN_PHOTOS, req.url));
  } else if (pathname === PATH_OG) {
    return NextResponse.redirect(new URL(PATH_OG_SAMPLE, req.url));
  }

  // Also rewrites path aliases, e.g., /t/* to /tag/*, once authorized
  return auth(
    req as unknown as NextApiRequest,
    res as unknown as NextApiResponse,
  );
}

export const config = {
  // Excludes:
  // - /api + /api/auth*
  // - /_next/static*
  // - /_next/image*
  // - /favicon.ico + /favicons/*
  // - /grid
  // - /full
  // - /library
  // - / (root)
  // - /home-image
  // - /template-image
  // - /template-image-tight
  // - /template-url
  // eslint-disable-next-line @stylistic/max-len
  matcher: ['/((?!api$|api/auth|_next/static|_next/image|favicon.ico$|favicons/|grid$|full$|library$|home-image$|template-image$|template-image-tight$|template-url$|$).*)'],
};
