import { Photo } from '..';
import { getNextImageUrlForRequest } from '@/utility/image';
import { formatModelShort } from '@/utility/exif';
import { AiFillApple } from 'react-icons/ai';

export default function PhotoOGImageResponse({
  photo,
  requestOrPhotoPath,
  width,
  height,
  fontFamily,
}: {
  photo: Photo
  requestOrPhotoPath: Request | string
  width: number
  height: number
  fontFamily: string
}) {
  return (
    <div style={{
      display: 'flex',
      position: 'relative',
      background: 'red',
      width,
      height,
    }}>
      <img
        src={typeof requestOrPhotoPath === 'string'
          ? requestOrPhotoPath
          : getNextImageUrlForRequest(
            photo.url,
            requestOrPhotoPath,
            width,
          )}
        width={width}
        height={width / photo.aspectRatio}
        alt={photo.title}
      />
      <div style={{
        display: 'flex',
        gap: 36,
        position: 'absolute',
        padding: '400px 56px 48px 56px',
        color: 'white',
        background:
          'linear-gradient(to bottom, ' +
          'rgba(0,0,0,0), rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
        backgroundBlendMode: 'multiply',
        fontFamily,
        fontSize: 60,
        lineHeight: 1,
        bottom: 0,
        left: 0,
        right: 0,
      }}>
        {photo.make === 'Apple' &&
          <div style={{ display: 'flex' }}>
            <AiFillApple />
          </div>}
        <div style={{ display: 'flex' }}>
          {formatModelShort(photo.model)}
        </div>
        <div style={{ display: 'flex' }}>
          {photo.focalLengthFormatted}
        </div>
        <div style={{ display: 'flex' }}>
          {photo.fNumberFormatted}
        </div>
        <div>
          {photo.isoFormatted}
        </div>
      </div>
    </div>
  );
};
