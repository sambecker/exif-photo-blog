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
    getPhotosCached({ tag: TAG_FAVS, limit: 3 }).catch(() => []),
    getAllPhotoIdsWithUpdatedAt().catch(() => []),
    getDataForCategoriesCached().catch(() => (NULL_CATEGORY_DATA)),
  ]);

  const lastModifiedSite = getLastModifiedForCategories(
    categories,
    photos,
  );

  return <AboutPageClient
    heroPhoto={favs[2]}
    categories={categories}
    lastUpdated={lastModifiedSite}
  />;
}
