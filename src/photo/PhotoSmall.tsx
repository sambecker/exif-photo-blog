import { Photo, titleForPhoto } from '.';
import ImageSmall from '@/components/ImageSmall';
import Link from 'next/link';
import { cc } from '@/utility/css';
import { pathForPhoto } from '@/site/paths';
import { Camera } from '@/camera';
import { FilmSimulation } from '@/simulation';

export default function PhotoSmall({
  photo,
  tag,
  camera,
  simulation,
  selected,
}: {
  photo: Photo
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  selected?: boolean
}) {
  return (
    <Link
      href={pathForPhoto(photo, tag, camera, simulation)}
      className={cc(
        'active:brightness-75',
        selected && 'brightness-50',
      )}
    >
      <ImageSmall
        src={photo.url}
        aspectRatio={photo.aspectRatio}
        blurData={photo.blurData}
        className="w-full"
        alt={titleForPhoto(photo)}
      />
    </Link>
  );
};
