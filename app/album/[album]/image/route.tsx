import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response/size';
import AlbumImageResponse from '@/album/AlbumImageResponse';
import { getAlbumFromSlug } from '@/album/query';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export async function GET(
  _: Request,
  context: { params: Promise<{ album: string }> },
) {
  const { album: albumParam } = await context.params;

  const album = await getAlbumFromSlug(decodeURIComponent(albumParam));

  if (!album) { return new Response('Album not found', { status: 404 }); }

  return cachedOgPhotoResponse(
    { album },
    { album, limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY },
    args => <AlbumImageResponse {...{ album, ...args }}/>,
  );
}
