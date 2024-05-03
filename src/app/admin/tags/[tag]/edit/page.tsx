import AdminChildPage from '@/components/AdminChildPage';
import { redirect } from 'next/navigation';
import { getPhotosCached } from '@/photo/cache';
import TagForm from '@/tag/TagForm';
import { PATH_ADMIN, PATH_ADMIN_TAGS, pathForTag } from '@/site/paths';
import PhotoLightbox from '@/photo/PhotoLightbox';
import { getPhotosTagMeta } from '@/photo/db';
import AdminTagBadge from '@/admin/AdminTagBadge';

const MAX_PHOTO_TO_SHOW = 6;

interface Props {
  params: { tag: string }
}

export default async function PhotoPageEdit({
  params: { tag: tagFromParams } }: Props
) {
  const tag = decodeURIComponent(tagFromParams);
  
  const [
    { count },
    photos,
  ] = await Promise.all([
    getPhotosTagMeta(tag),
    getPhotosCached({ tag, limit: MAX_PHOTO_TO_SHOW }),
  ]);

  if (count === 0) { redirect(PATH_ADMIN); }

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_TAGS}
      backLabel="Tags"
      breadcrumb={<AdminTagBadge {...{ tag, count, hideBadge: true }} />}
    >
      <TagForm {...{ tag, photos }}>
        <PhotoLightbox
          {...{ count, photos }}
          maxPhotosToShow={MAX_PHOTO_TO_SHOW}
          moreLink={pathForTag(tag)}
        />
      </TagForm>
    </AdminChildPage>
  );
};
