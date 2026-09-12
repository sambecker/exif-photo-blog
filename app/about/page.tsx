import { getAboutMeta } from '@/about';
import AboutPageClient from '@/about/AboutPageClient';
import { getAboutDataCached, getAboutFolderRows } from '@/about/data';
import {
  ABOUT_DESCRIPTION_DEFAULT,
  SHOW_ABOUT_PAGE,
  SHOW_NEW_ABOUT_PAGE,
} from '@/app/config';
import { PATH_ROOT } from '@/app/path';
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
import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default async function AboutPage() {
  if (!SHOW_ABOUT_PAGE) { redirect(PATH_ROOT); }
  
  const appText = await getAppText();

  const [
    {
      about,
      photoAvatar,
      photoHero,
    },
    photosMeta,
    photos,
    categories,
  ] = await Promise.all([
    getAboutDataCached({ includeHero: !SHOW_NEW_ABOUT_PAGE })
      .catch(() => ({
        about: undefined,
        photoAvatar: undefined,
        photoHero: undefined,
      })),
    getPhotosMetaCached().catch(() => {}),
    getAllPhotoIdsWithUpdatedAt().catch(() => []),
    getDataForCategoriesCached().catch(() => (NULL_CATEGORY_DATA)),
  ]);

  const description = about?.description || ABOUT_DESCRIPTION_DEFAULT;

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

  const place = albums
    .slice()
    .sort((a, b) => b.count - a.count)[0]?.album.location;

  const lastModifiedSite = max([
    getLastModifiedForCategories(categories, photos),
    about?.updatedAt,
  ].filter(date => date instanceof Date));

  const { title, subhead } = getAboutMeta(
    appText,
    about?.title,
    about?.subhead,
  );

  const folderRows = SHOW_NEW_ABOUT_PAGE
    ? await getAboutFolderRows(categories, appText)
    : undefined;

  return (
    (photosMeta?.count ?? 0) > 0
      ? <AboutPageClient
        title={title}
        subhead={subhead}
        descriptionHtml={descriptionHtml}
        photosCount={photosMeta?.count}
        photosOldest={photosMeta?.dateRange?.start}
        photoAvatar={photoAvatar}
        photoHero={photoHero}
        camera={cameras[0]?.camera}
        lens={lenses[0]?.lens}
        recipe={recipes[0]?.recipe}
        film={films[0]?.film}
        tag={tags.filter(({ tag }) => tag !== TAG_FAVS)[0]?.tag}
        place={place}
        album={albums[0]?.album}
        lastUpdated={lastModifiedSite}
        folderRows={folderRows}
      />
      : <PhotosEmptyState />
  );
}
