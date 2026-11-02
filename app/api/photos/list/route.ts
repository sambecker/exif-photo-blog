import { auth } from '@/auth/server';
import { getPhotos } from '@/photo/query';
import {
  getVisibilityFromPhoto,
  VISIBILITY_VALUES,
  VisibilityValue,
} from '@/photo/visibility';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!(await auth())?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const [visibility, ...extra] = new URL(request.url).searchParams
    .getAll('visibility');
  if (
    extra.length > 0 ||
    (
      visibility !== undefined &&
      !VISIBILITY_VALUES.includes(visibility as VisibilityValue)
    )
  ) {
    return new Response(
      `Accepts one visibility value: ${VISIBILITY_VALUES.join(', ')}`,
      { status: 400 },
    );
  }

  const photos = await getPhotos({ hidden: 'include', limit: 10_000 });
  return Response.json({
    photos: photos
      .map(photo => ({
        id: photo.id,
        title: photo.title ?? '',
        url: photo.url,
        takenAt: photo.takenAt,
        visibility: getVisibilityFromPhoto(photo),
        createdAt: photo.createdAt,
      }))
      .filter(photo =>
        visibility === undefined || photo.visibility === visibility),
  }, { headers: { 'Cache-Control': 'no-store' } });
}
