import type { Photo } from '../photo';
import ImageCaption from '@/image-response/components/ImageCaption';
import ImagePhotoGrid from '@/image-response/components/ImagePhotoGrid';
import ImageContainer from '@/image-response/components/ImageContainer';
import type { NextImageSize } from '@/platforms/next-image';
import { Album } from '.';
import IconAlbum from '@/components/icons/IconAlbum';

export default function AlbumImageResponse({
  album,
  photos,
  width,
  height,
  fontFamily,
}: {
  album: Album,
  photos: Photo[]
  width: NextImageSize
  height: number
  fontFamily: string
}) {  
  return (
    <ImageContainer solidBackground={photos.length === 0}>
      <ImagePhotoGrid
        {...{
          photos,
          width,
          height,
        }}
      />
      <ImageCaption {...{
        width,
        height,
        fontFamily,
        icon: <IconAlbum
          size={height * .07}
          style={{
            transform: `translateY(${height * .004}px)`,
            marginRight: height * .03,
          }}
        />,
        title: album.title.toLocaleUpperCase(),
      }} />
    </ImageContainer>
  );
}
