import AboutPageClient from '@/about/AboutPageClient';
import { getAboutCached } from '@/about/cache';
import { SHOW_ABOUT_PAGE } from '@/app/config';
import { PATH_ROOT } from '@/app/path';
import { getDataForCategoriesCached } from '@/category/cache';
import {
  getLastModifiedForCategories,
  NULL_CATEGORY_DATA,
} from '@/category/data';
import {
  getPhotoCached,
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { getAllPhotoIdsWithUpdatedAt } from '@/photo/query';
import { TAG_FAVS } from '@/tag';
import { safelyParseFormattedHtml } from '@/utility/html';
import { max } from 'date-fns';
import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default async function AboutPage() {
  if (!SHOW_ABOUT_PAGE) { redirect(PATH_ROOT); }

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
    getAboutCached()
      .then(async about => {
        const photoAvatar = await (about?.photoIdAvatar
          ? getPhotoCached(about?.photoIdAvatar ?? '', true)
          : undefined);
        const photoHero = await (about?.photoIdHero
          ? getPhotoCached(about?.photoIdHero ?? '', true)
          // Fall back to favorite photos if no hero photo is set
          : getPhotosCached({ tag: TAG_FAVS, limit: 1 })
            .then(photos => photos.length > 0
              ? photos[0]
              // Fall back to oldest photo if no favorite photos exist
              : getPhotosCached({ limit: 1, sortBy: 'takenAtAsc' })
                .then(photos => photos[0])));
        return {
          about,
          photoAvatar,
          photoHero,
        };
      }).catch(() => ({
        about: undefined,
        photoAvatar: undefined,
        photoHero: undefined,
      })),
    getPhotosMetaCached().catch(() => {}),
    getAllPhotoIdsWithUpdatedAt().catch(() => []),
    getDataForCategoriesCached().catch(() => (NULL_CATEGORY_DATA)),
  ]);

  const description = about?.description
    ? <div dangerouslySetInnerHTML={{
      __html: safelyParseFormattedHtml(about.description),
    }} />
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
    about?.updatedAt,
  ].filter(date => date instanceof Date));

  return (
    (photosMeta?.count ?? 0) > 0
      ? <AboutPageClient
        title={about?.title}
        subhead={about?.subhead}
        description={description}
        photosCount={photosMeta?.count}
        photosOldest={photosMeta?.dateRange?.start}
        photoAvatar={photoAvatar}
        photoHero={photoHero}
        camera={cameras[0]?.camera}
        lens={lenses[0]?.lens}
        recipe={recipes[0]?.recipe}
        film={films[0]?.film}
        album={albums[0]?.album}
        tag={tags.filter(({ tag }) => tag !== TAG_FAVS)[0]?.tag}
        lastUpdated={lastModifiedSite}
      />
      : <PhotosEmptyState />
  );
}
