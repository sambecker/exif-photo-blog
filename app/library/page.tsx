import { getLibraryMeta } from '@/library';
import LibraryPageClient from '@/library/LibraryPageClient';
import { getLibraryDataCached, getLibraryFolderRows } from '@/library/data';
import { LIBRARY_DESCRIPTION_DEFAULT } from '@/app/config';
import { getDataForCategoriesCached } from '@/category/cache';
import {
  getLastModifiedForCategories,
  NULL_CATEGORY_DATA,
} from '@/category/data';
import { getAppText } from '@/i18n/state/server';
import { getPhotosMetaCached } from '@/photo/cache';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { getAllPhotoIdsWithUpdatedAt } from '@/photo/query';
import { TAG_FAVS } from '@/tag';
import { safelyParseFormattedHtml } from '@/utility/html';
import { max } from 'date-fns';

export const dynamic = 'force-static';

export default async function LibraryPage() {  
  const appText = await getAppText();

  const [
    {
      library,
      photoAvatar,
    },
    photosMeta,
    photos,
    categories,
  ] = await Promise.all([
    getLibraryDataCached()
      .catch(() => ({
        library: undefined,
        photoAvatar: undefined,
      })),
    getPhotosMetaCached().catch(() => {}),
    getAllPhotoIdsWithUpdatedAt().catch(() => []),
    getDataForCategoriesCached().catch(() => (NULL_CATEGORY_DATA)),
  ]);

  const description = library?.description || LIBRARY_DESCRIPTION_DEFAULT;

  const descriptionHtml = description
    ? <div
      className="text-medium [&>*>a]:underline"
      dangerouslySetInnerHTML={{
        __html: safelyParseFormattedHtml(description),
      }}
    />
    : undefined;

  const {
    cameras,
    lenses,
    albums,
    tags,
    recipes,
    films,
  } = categories;

  const lastModifiedSite = max([
    getLastModifiedForCategories(categories, photos),
    library?.updatedAt,
  ].filter(date => date instanceof Date));

  const { title, subhead } = getLibraryMeta(
    appText,
    library?.title,
    library?.subhead,
  );

  const folderRows = await getLibraryFolderRows(categories, appText);

  return (
    (photosMeta?.count ?? 0) > 0
      ? <LibraryPageClient
        title={title}
        subhead={subhead}
        descriptionHtml={descriptionHtml}
        photosCount={photosMeta?.count}
        photosOldest={photosMeta?.dateRange?.start}
        photoAvatar={photoAvatar}
        camera={cameras[0]?.camera}
        lens={lenses[0]?.lens}
        recipe={recipes[0]?.recipe}
        film={films[0]?.film}
        tag={tags.filter(({ tag }) => tag !== TAG_FAVS)[0]?.tag}
        album={albums[0]?.album}
        lastUpdated={lastModifiedSite}
        folderRows={folderRows}
      />
      : <PhotosEmptyState />
  );
}
