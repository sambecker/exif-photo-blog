import { getPhotos } from '@/photo/db/query';
import { redirect } from 'next/navigation';

export default async function AdminRecipePage() {
  const photos = await getPhotos({ limit: 1});
  redirect(`/admin/recipe/${photos[0].id}`);
}
