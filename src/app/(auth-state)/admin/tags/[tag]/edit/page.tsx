import AdminChildPage from '@/components/AdminChildPage';
import { redirect } from 'next/navigation';
import { getPhotosCached } from '@/cache';
import TagForm from '@/tag/TagForm';
import { PATH_ADMIN, PATH_ADMIN_TAGS } from '@/site/paths';
import { getPhotosTagCount } from '@/services/postgres';
import PhotoTag from '@/tag/PhotoTag';
import { photoQuantityText } from '@/photo';
import PhotoGrid from '@/photo/PhotoGrid';

export const runtime = 'edge';

interface Props {
  params: { tag: string }
}

export default async function PhotoPageEdit({ params: { tag } }: Props) {
  const [
    count,
    photos,
  ] = await Promise.all([
    getPhotosTagCount(tag),
    getPhotosCached({ tag }),
  ]);

  if (count === 0) { redirect(PATH_ADMIN); }

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_TAGS}
      backLabel="Tags"
      breadcrumb={<div className="flex item gap-2">
        <PhotoTag {...{ tag }} />
        <div className="text-dim uppercase">
          {photoQuantityText(count, false)}
        </div>
      </div>}
    >
      <div className="space-y-8">
        <PhotoGrid
          photos={photos.slice(0, 12)}
          animate={false}
          small
        />
        <TagForm {...{ tag, photos }} />
      </div>
    </AdminChildPage>
  );
};
