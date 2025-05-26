import type { MetadataRoute } from 'next';
import { getUniqueTags } from '@/photo/db/query';
import { absolutePathForTag } from '@/app/paths';

// Cache for 24 hours
export const revalidate = 86_400;
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tags = await getUniqueTags();

  return tags.map(({ tag, lastModified }) => ({
    url: absolutePathForTag(tag),
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
}
