import { getSharedLinkInfo } from '@/platforms/immich/client';
import { NextResponse } from 'next/server';
import {
  IMMICH_SHARE_ALBUM_ID_COOKIE,
  IMMICH_SHARE_KEY_COOKIE,
} from '@/app/paths';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ share_key: string }> },
) {
  const { share_key } = await params;

  if (!share_key) {
    return new NextResponse('Share key is required', { status: 400 });
  }

  try {
    const linkInfo = await getSharedLinkInfo(share_key);
    if (!linkInfo || !linkInfo.album || !linkInfo.album.id) {
      throw new Error('Invalid share link');
    }

    if (linkInfo.expiresAt && new Date(linkInfo.expiresAt) < new Date()) {
      throw new Error('Share link has expired');
    }

    const response = NextResponse.redirect(new URL('/', _request.url));

    response.cookies.set(IMMICH_SHARE_KEY_COOKIE, share_key, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 天
    });
    response.cookies.set(IMMICH_SHARE_ALBUM_ID_COOKIE, linkInfo.album.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 天
    });

    return response;

  } catch (error) {
    console.error(`Failed to validate share key "${share_key}":`, error);
    return new NextResponse('Invalid or expired share key', { status: 401 });
  }
}