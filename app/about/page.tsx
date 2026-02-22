import AboutPageClient from '@/about/AboutPageClient';
import { getDataForCategoriesCached } from '@/category/cache';
import { getLastModifiedForCategories } from '@/category/data';
import { getAllPhotoIdsWithUpdatedAt } from '@/photo/query';

export default async function AboutPage() {
  const [
    categories,
    photos,
  ] = await Promise.all([
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
    getAllPhotoIdsWithUpdatedAt().catch(() => []),
  ]);

  const lastModifiedSite = getLastModifiedForCategories(
    categories,
    photos,
  );
  return <AboutPageClient lastUpdated={lastModifiedSite} />;
}
