import AboutPageClient from '@/about/AboutPageClient';
import { getDataForCategoriesCached } from '@/category/cache';
import {
  getLastModifiedForCategories,
  NULL_CATEGORY_DATA,
} from '@/category/data';
import { getPhotosCached } from '@/photo/cache';
import { getAllPhotoIdsWithUpdatedAt } from '@/photo/query';
import { TAG_FAVS } from '@/tag';

export default async function AboutPage() {
  const [
    favs,
    photos,
    categories,
  ] = await Promise.all([
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

  const lastModifiedSite = getLastModifiedForCategories(
    categories,
    photos,
  );

  return (
    <AboutPageClient
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
