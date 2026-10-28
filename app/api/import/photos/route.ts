import { auth } from '@/auth/server';
import { getPhotos } from '@/photo/query';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!(await auth())?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const hidden = new URL(request.url).searchParams.get('hidden') ?? 'include';
  if (hidden !== 'include' && hidden !== 'only' && hidden !== 'exclude') {
    return new Response('Invalid hidden filter', { status: 400 });
  }

  const photos = await getPhotos({ hidden, limit: 10_000 });
  return Response.json({
    photos: photos.map(({ id, title, url, takenAt, hidden, createdAt }) => ({
      id,
      title: title ?? '',
      url,
      takenAt,
      hidden: Boolean(hidden),
      createdAt,
    })),
  }, { headers: { 'Cache-Control': 'no-store' } });
}
