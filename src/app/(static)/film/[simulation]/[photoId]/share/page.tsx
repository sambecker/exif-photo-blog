import { getPhotoCached } from '@/cache';
import PhotoShareModal from '@/photo/PhotoShareModal';
import { getPhotos, getUniqueFilmSimulations } from '@/services/postgres';
import { FilmSimulation } from '@/simulation';
import { PATH_ROOT } from '@/site/paths';
import { redirect } from 'next/navigation';

interface PhotoFilmSimulationProps {
  params: { photoId: string, simulation: FilmSimulation }
}

export async function generateStaticParams() {
  const params: PhotoFilmSimulationProps[] = [];

  const simulations = await getUniqueFilmSimulations();
  simulations.forEach(async ({ simulation }) => {
    const photos = await getPhotos({ simulation });
    params.push(...photos.map(photo => ({
      params: { photoId: photo.id, simulation },
    })));
  });

  return params;
}

export default async function Share({
  params: { photoId, simulation },
}: PhotoFilmSimulationProps) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { return redirect(PATH_ROOT); }

  return <PhotoShareModal {...{ photo, simulation }} />;
}
