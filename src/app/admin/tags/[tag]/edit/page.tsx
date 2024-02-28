import AdminChildPage from '@/components/AdminChildPage';
import { redirect } from 'next/navigation';
import { getPhotosCached, getPhotosTagCountCached } from '@/photo/cache';
import TagForm from '@/tag/TagForm';
import { PATH_ADMIN, PATH_ADMIN_TAGS, pathForTag } from '@/site/paths';
import PhotoTag from '@/tag/PhotoTag';
import { photoLabelForCount } from '@/photo';
import PhotoLightbox from '@/photo/PhotoLightbox';
import FavsTag from '@/tag/FavsTag';
import { isTagFavs } from '@/tag';

const MAX_PHOTO_TO_SHOW = 6;

interface Props {
  params: { tag: string }
}

export default async function PhotoPageEdit({
  params: { tag: tagFromParams } }: Props
) {
  const tag = decodeURIComponent(tagFromParams);
  
  const [
    count,
    photos,
  ] = await Promise.all([
    getPhotosTagCountCached(tag),
    getPhotosCached({ tag, limit: MAX_PHOTO_TO_SHOW }),
  ]);

  if (count === 0) { redirect(PATH_ADMIN); }

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_TAGS}
      backLabel="Tags"
      breadcrumb={<div className="flex items-center gap-2">
        {isTagFavs(tag)
          ? <div className="[&>*>*>*>svg]:translate-y-[0.5px]">
            <FavsTag />
          </div>
          : <div className="[&>*>*>*>svg]:translate-y-[1.5px]">
            <PhotoTag {...{ tag }} />
          </div>}
        <div className="text-dim uppercase">
          <span>{count}</span>
          <span className="hidden xs:inline-block">
            &nbsp;
            {photoLabelForCount(count)}
          </span>
        </div>
      </div>}
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
