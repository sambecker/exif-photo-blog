import AboutPageClient from '@/about/AboutPageClient';
import { getDataForCategoriesCached } from '@/category/cache';
import { getLastModifiedForCategories } from '@/category/data';
import { getPhotosCached } from '@/photo/cache';
import { getAllPhotoIdsWithUpdatedAt } from '@/photo/query';
import { TAG_FAVS } from '@/tag';

export default async function AboutPage() {
  const [
    favs,
    photos,
    categories,
  ] = await Promise.all([
    getPhotosCached({ tag: TAG_FAVS, limit: 1 }),
    getAllPhotoIdsWithUpdatedAt().catch(() => []),
    getDataForCategoriesCached().catch(() => ({
      recents: [],
      years: [],
      cameras: [],
      lenses: [],
      albums: [],
      tags: [],
      recipes: [],
      films: [],
      focalLengths: [],
    })),
  ]);

  const lastModifiedSite = getLastModifiedForCategories(
    categories,
    photos,
  );

  return <AboutPageClient
    heroPhoto={favs[0]}
    categories={categories}
    lastUpdated={lastModifiedSite}
  />;
}
