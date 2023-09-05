import SiteGrid from '@/components/SiteGrid';
import PhotoGrid from '@/photo/PhotoGrid';
import { getPhotos } from '@/services/postgres';

export const runtime = 'edge';

const PHOTOS_PER_PAGE = 6;

export default async function GridPage(
  { params }: { params: Record<string, string> }
) {
  const offset = parseInt(params.offset ?? '0');
  
  const photos = await getPhotos(
    undefined,
    PHOTOS_PER_PAGE,
    Number.isNaN(offset) ? 0 : offset,
  );
  
  return (
    <SiteGrid
      contentMain={<PhotoGrid
        photos={photos}
        offset={offset}
        staggerOnFirstLoadOnly
      />}
    />
  );
}
