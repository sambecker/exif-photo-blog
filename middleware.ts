import { auth } from './src/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  IMMICH_SHARE_ALBUM_ID_COOKIE,
  IMMICH_SHARE_KEY_COOKIE,
  PATH_ADMIN,
  PATH_ADMIN_PHOTOS,
  PATH_OG,
  PATH_OG_SAMPLE,
  PREFIX_PHOTO,
  PREFIX_TAG,
} from './src/app/paths';

export default function middleware(req: NextRequest, res: NextResponse) {
  const pathname = req.nextUrl.pathname;

  // 获取 share_key 和 album_id (cookie 会自动传递，不需要额外处理)
  const shareKey = req.cookies.get(IMMICH_SHARE_KEY_COOKIE)?.value;
  const albumId = req.cookies.get(IMMICH_SHARE_ALBUM_ID_COOKIE)?.value;

  console.log('Middleware shareKey:', shareKey, 'albumId:', albumId);

  let response: NextResponse;
  // 处理路径重写逻辑
  if (pathname === PATH_ADMIN) {
    response = NextResponse.redirect(new URL(PATH_ADMIN_PHOTOS, req.url));
  } else if (pathname === PATH_OG) {
    response = NextResponse.redirect(new URL(PATH_OG_SAMPLE, req.url));
  } else if (/^\/photos\/(.)+$/.test(pathname)) {
    const matches = pathname.match(/^\/photos\/(.+)$/);
    response = NextResponse.rewrite(new URL(
      `${PREFIX_PHOTO}/${matches?.[1]}`,
      req.url,
    ));
  } else if (/^\/t\/(.)+$/.test(pathname)) {
    const matches = pathname.match(/^\/t\/(.+)$/);
    response = NextResponse.rewrite(new URL(
      `${PREFIX_TAG}/${matches?.[1]}`,
      req.url,
    ));
  } else {
    response = NextResponse.next();
  }

  // Cookie 会自动传递给后续请求，不需要额外设置 header
  return response;
}

export const config = {
  // Excludes:
  // - /api + /api/auth*
  // - /_next/static*
  // - /_next/image*
  // - /favicon.ico + /favicons/*
  // - /grid
  // - /feed
  // - /home-image
  // - /template-image
  // - /template-image-tight
  // - /template-url
  // Include root path (/) and all other paths
  // eslint-disable-next-line max-len
  matcher: ['/((?!_next/static|_next/image|favicon.ico$|favicons/|grid$|feed$|home-image$|template-image$|template-image-tight$|template-url$).*)', '/'],
};