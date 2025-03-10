import type { Photo } from '../photo';
import { FaStar, FaTag } from 'react-icons/fa';
import ImageCaption from './components/ImageCaption';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import ImageContainer from './components/ImageContainer';
import type { NextImageSize } from '@/platforms/next-image';
import { formatTag, isTagFavs } from '@/tag';

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
          ? <FaStar
            size={height * .066}
            style={{
              // Fix horizontal distortion in icon size
              width: height * .076,
              marginRight: height * .015,
            }}
          />
          : <FaTag
            size={height * .06}
            style={{
              transform: `translateY(${height * .006}px)`,
              marginRight: height * .02,
            }}
          />,
        title: formatTag(tag).toLocaleUpperCase(),
      }} />
    </ImageContainer>
  );
}
