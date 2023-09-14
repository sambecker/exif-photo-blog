import SiteGrid from '@/components/SiteGrid';
import PhotoGrid from '@/photo/PhotoGrid';
import { getPhotos } from '@/services/postgres';
import PhotoTag from '@/tag/PhotoTag';

export default async function TagPage({
  params: { tag },
}: {
  params: { tag: string }
}) {
  const photos = await getPhotos(undefined, undefined, undefined, tag);

  return (
    <SiteGrid
      contentMain={<div className="space-y-8 mt-4">
        <div className="flex items-center gap-2">
          <PhotoTag tag={tag} />
          <span className="uppercase text-gray-400 dark:text-gray-500">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>
        <PhotoGrid photos={photos} />
      </div>}
    />
  );
}
