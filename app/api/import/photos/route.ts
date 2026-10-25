import { IMPORT_API_ENABLED } from '@/app/config';
import { verifyImportRequest } from '@/import/auth';
import { getPhotos } from '@/photo/query';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!IMPORT_API_ENABLED) {
    return new Response('Not Found', { status: 404 });
  }

  const rawBody = Buffer.from(await request.arrayBuffer());
  if (!verifyImportRequest(request, rawBody, process.env.IMPORT_PUBLIC_KEY)) {
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
