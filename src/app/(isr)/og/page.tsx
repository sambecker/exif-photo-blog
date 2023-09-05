import StaggeredPhotos from '@/photo/StaggeredPhotos';
import { getPhotos } from '@/services/postgres';

export const runtime = 'edge';

export default async function GridPage() {
  const photos = await getPhotos();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <StaggeredPhotos photos={photos} />
    </div>
  );
}
