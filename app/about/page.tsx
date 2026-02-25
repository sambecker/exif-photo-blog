import AboutPageClient from '@/about/AboutPageClient';
import { getAboutCached } from '@/about/cache';
import { getDataForCategoriesCached } from '@/category/cache';
import {
  getLastModifiedForCategories,
  NULL_CATEGORY_DATA,
} from '@/category/data';
import { getPhotosCached, getPhotosMetaCached } from '@/photo/cache';
import { getAllPhotoIdsWithUpdatedAt } from '@/photo/query';
import { TAG_FAVS } from '@/tag';

export default async function AboutPage() {
  const [
    _about,
    photosMeta,
    favs,
    photos,
    categories,
  ] = await Promise.all([
    getAboutCached(),
    getPhotosMetaCached().catch(() => {}),
    getPhotosCached({ tag: TAG_FAVS, limit: 12 }).catch(() => []),
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

  // TODO: take About data into account
  const lastModifiedSite = getLastModifiedForCategories(
    categories,
    photos,
  );

  return (
    <AboutPageClient
      title="About this site"
      subhead="A brief subhead here"
      // eslint-disable-next-line max-len
      description="A digital gallery dedicated to the beauty of the mundane. This blog explores the intersection of light, shadow, and silence. No filters, no noise—just the world as it sits when we stop to look."
      photosCount={photosMeta?.count}
      photosOldest={photosMeta?.dateRange?.start}
      photoAvatar={favs[5]}
      photoHero={favs[3]}
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
