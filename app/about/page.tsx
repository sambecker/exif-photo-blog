import AboutPageClient from '@/about/AboutPageClient';
import { getAboutCached } from '@/about/cache';
import { getDataForCategoriesCached } from '@/category/cache';
import {
  getLastModifiedForCategories,
  NULL_CATEGORY_DATA,
} from '@/category/data';
import { getPhotoCached, getPhotosMetaCached } from '@/photo/cache';
import { getAllPhotoIdsWithUpdatedAt } from '@/photo/query';
import { TAG_FAVS } from '@/tag';
import { max } from 'date-fns';

export default async function AboutPage() {
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
        const photoAvatar = about?.photoIdAvatar
          ? await getPhotoCached(about?.photoIdAvatar ?? '', true)
          : undefined;
        // Add fallback behavior to grab latest favorite
        // or oldest photo
        const photoHero = about?.photoIdHero
          ? await getPhotoCached(about?.photoIdHero ?? '', true)
          : undefined;
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
    <AboutPageClient
      title={about?.title}
      subhead={about?.subhead}
      description={about?.description}
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
  );
}
