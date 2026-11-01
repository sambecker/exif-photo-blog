import { auth } from '@/auth/server';
import { getPhotos } from '@/photo/query';
import { getVisibilityFromPhoto } from '@/photo/visibility';

export const runtime = 'nodejs';

export async function GET() {
  if (!(await auth())?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const photos = await getPhotos({ hidden: 'include', limit: 10_000 });
  return Response.json({
    photos: photos.map(photo => ({
      id: photo.id,
      title: photo.title ?? '',
      url: photo.url,
      takenAt: photo.takenAt,
      visibility: getVisibilityFromPhoto(photo),
      createdAt: photo.createdAt,
    })),
  }, { headers: { 'Cache-Control': 'no-store' } });
}
