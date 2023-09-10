import { PropsWithChildren } from 'react';
import AnimateItems from '@/components/AnimateItems';
import PhotoLinks from '@/photo/PhotoLinks';
import SiteGrid from '@/components/SiteGrid';
import {
  PHOTOS_PER_REQUEST,
  ogImageDescriptionForPhoto,
  ogImageUrlForPhoto,
  titleForPhoto,
} from '@/photo';
import PhotoGrid from '@/photo/PhotoGrid';
import PhotoLarge from '@/photo/PhotoLarge';
import { cc } from '@/utility/css';
import { Metadata } from 'next';
import { BASE_URL } from '@/site/config';
import {
  getPhoto,
  getPhotosTakenAfterPhotoInclusive,
  getPhotosTakenBeforePhoto,
} from '@/services/postgres';
import { redirect } from 'next/navigation';

export const runtime = 'edge';

interface Props extends PropsWithChildren {
  params: { photoId: string }
}

export async function generateMetadata(
  { params: { photoId } }: Props
): Promise<Metadata> {
  const photo = await getPhoto(photoId);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = ogImageDescriptionForPhoto(photo);
  const images = ogImageUrlForPhoto(photo);

  return {
    title,
    description,
    openGraph: {
      title,
      images,
      description,
      url: `${BASE_URL}/photos/${photo.idShort}`,
    },
    twitter: {
      title,
      description,
      images,
      card: 'summary_large_image',
    },
  };
}

export default async function PhotoPage({
  params: { photoId },
  children,
}: Props) {
  const photo = await getPhoto(photoId);

  if (!photo) { redirect('/'); }

  const photosBefore = await getPhotosTakenBeforePhoto(photo, 1);
  const photosAfter = await getPhotosTakenAfterPhotoInclusive(
    photo,
    PHOTOS_PER_REQUEST + 1,
  );
  const photos = photosBefore.concat(photosAfter);

  return <>
    {children}
    <div className="md:space-y-8">
      <AnimateItems
        animateFromAppState
        items={[<PhotoLarge
          key={photo.id}
          photo={photo}
          priority
          showShare
        />]}
      />
      <SiteGrid
        sideFirstOnMobile
        contentMain={<PhotoGrid
          photos={photosAfter.slice(1)}
          animateOnFirstLoadOnly
          staggerOnFirstLoadOnly
        />}
        contentSide={<div className={cc(
          'grid grid-cols-2',
          'md:flex md:gap-4',
          'user-select-none',
        )}>
          <PhotoLinks photo={photo} photos={photos} />
        </div>}
      />
    </div>
  </>;
}
