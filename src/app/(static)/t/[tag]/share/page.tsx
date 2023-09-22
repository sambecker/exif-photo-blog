import { getPhotosCached } from '@/cache';
import SiteGrid from '@/components/SiteGrid';
import PhotoGrid from '@/photo/PhotoGrid';
import TagHeader from '@/tag/TagHeader';
import TagShareModal from '@/tag/TagShareModal';

export const runtime = 'edge';

export default async function Share({
  params: { tag },
}: {
  params: { tag: string }
}) {
  const photos = await getPhotosCached({ tag });
  return <>
    <TagShareModal tag={tag} photos={photos} />
    <SiteGrid
      key="Tag Grid"
      contentMain={<div className="space-y-8 mt-4">
        <TagHeader tag={tag} photos={photos} />
        <PhotoGrid photos={photos} tag={tag} animate={false} />
      </div>}
    />
  </>;
}
