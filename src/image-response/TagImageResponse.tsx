import type { Photo } from '../photo';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import type { NextImageSize } from '@/platforms/next-image';
import { formatTag, isTagFavs } from '@/tag';
import IconTag from '@/components/icons/IconTag';
import IconFavs from '@/components/icons/IconFavs';

export default function TagImageResponse({
  tag,
  photos,
  width,
  height,
  fontFamily,
}: {
  tag: string,
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
        icon: isTagFavs(tag)
          ? <IconFavs
            size={height * .066}
            style={{
              // Fix horizontal distortion in icon size
              width: height * .076,
              marginRight: height * .015,
            }}
          />
          : <IconTag
            size={height * .0725}
            style={{
              transform: `translateY(${height * .007}px)`,
              marginRight: height * .01,
            }}
          />,
        title: formatTag(tag).toLocaleUpperCase(),
      }} />
    </ImageContainer>
  );
}
