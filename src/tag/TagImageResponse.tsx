import type { Photo } from '../photo';
import ImageCaption from '@/image-response/components/ImageCaption';
import ImagePhotoGrid from '@/image-response/components/ImagePhotoGrid';
import ImageContainer from '@/image-response/components/ImageContainer';
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
          ? <span tw="text-amber-500">
            <IconFavs
              size={height * .066}
              style={{
                // Fix horizontal distortion in icon size
                width: height * .076,
                marginRight: height * .015,
                transform: `translateY(${-height * .0015}px)`,
              }}
              highlight
            />
          </span>
          : <IconTag
            size={height * .07}
            style={{
              transform: `translateY(${height * .004}px)`,
              marginRight: height * .01,
            }}
          />,
        title: formatTag(tag).toLocaleUpperCase(),
      }} />
    </ImageContainer>
  );
}
