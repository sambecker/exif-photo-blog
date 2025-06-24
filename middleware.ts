// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  IMMICH_SHARE_ALBUM_ID_COOKIE, IMMICH_SHARE_ALBUM_ID_HEADER,
  IMMICH_SHARE_KEY_COOKIE, IMMICH_SHARE_KEY_HEADER,
  PATH_ADMIN,
} from '@/app/paths';
import { validateShareKey } from '@/platforms/immich/auth/validation';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.host;
  const protocol = request.headers.get('x-forwarded-proto') ||
    (host?.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;
  if (process.env.USE_IMMICH_BACKEND === 'true' && pathname.startsWith(PATH_ADMIN)) {
    let response = NextResponse.redirect(new URL('/', baseUrl));
    response.cookies.delete(IMMICH_SHARE_KEY_COOKIE);
    response.cookies.delete(IMMICH_SHARE_ALBUM_ID_COOKIE);
    return response;
  }

  const shareKeyMatch = pathname.match(/^\/share\/([^\/]+)$/);
  if (shareKeyMatch) {
    const shareKey = shareKeyMatch[1];
    const shareContext = await validateShareKey(shareKey);
    if (!shareContext) {
      return NextResponse.redirect(new URL('/unauthorized', baseUrl));
    }

    if (shareContext.expiresAt && new Date() > shareContext.expiresAt) {
      return NextResponse.redirect(new URL('/unauthorized?reason=expired', baseUrl));
    }

    let response = NextResponse.redirect(new URL('/', baseUrl));
    response.cookies.set(IMMICH_SHARE_KEY_COOKIE, shareKey, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: shareContext.expiresAt
        ? Math.floor((shareContext.expiresAt.getTime() - Date.now()) / 1000)
        : 240 * 60 * 60
    });
    response.cookies.set(IMMICH_SHARE_ALBUM_ID_COOKIE, shareContext.albumId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: shareContext.expiresAt
        ? Math.floor((shareContext.expiresAt.getTime() - Date.now()) / 1000)
        : 240 * 60 * 60
    });

    // set headers for first request
    response.headers.set(IMMICH_SHARE_KEY_HEADER, shareKey);
    response.headers.set(IMMICH_SHARE_ALBUM_ID_HEADER, shareContext.albumId);

    return response;
  }

  const shareKey = request.cookies.get(IMMICH_SHARE_KEY_COOKIE)?.value;
  const albumId = request.cookies.get(IMMICH_SHARE_ALBUM_ID_COOKIE)?.value;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(IMMICH_SHARE_ALBUM_ID_HEADER, albumId || '');
  requestHeaders.set(IMMICH_SHARE_KEY_HEADER, shareKey || '');
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};