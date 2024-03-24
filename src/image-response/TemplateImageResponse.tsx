import { Photo } from '../photo';
import IconFullFrame from '@/site/IconFullFrame';
import IconGrid from '@/site/IconGrid';
import ImagePhotoGrid from './components/ImagePhotoGrid';
import { NextImageSize } from '@/services/next-image';

export default function TemplateImageResponse({
  photos,
  width,
  height,
  fontFamily,
  outerMargin = 50,
  includeHeader = true,
  darkMode = true,
  verticalOffset,
}: {
  photos: Photo[]
  width: NextImageSize
  height: number
  fontFamily: string
  outerMargin?: number
  includeHeader?: boolean
  darkMode?: boolean
  verticalOffset?: number
}) {
  const innerWidth = width - (outerMargin * 2);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: outerMargin,
      ...darkMode
        ? { background: 'black', color: 'white' }
        : { background: 'white', color: 'black' },
      width,
      height,
      fontFamily,
    }}>
      {includeHeader &&
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: 40,
          height: 80,
          lineHeight: 1,
          marginBottom: outerMargin,
          width: '100%',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexGrow: 1,
          }}>
            <div style={{
              display: 'flex',
              border: '2px solid #333',
              alignItems: 'center',
              borderRadius: 8,
            }}>
              <div style={{
                display: 'flex',
                padding: '3px 10px',
                color: '#333',
                borderRight: '2px solid #333',
              }}>
                <IconFullFrame includeTitle={false} width={80} />
              </div>
              <div style={{
                display: 'flex',
                padding: '3px 10px',
              }}>
                <IconGrid includeTitle={false} width={80} />
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexGrow: 1,
          }}>
            photos.sambecker.com
          </div>
        </div>}
      <div style={{
        display: 'flex',
        ...verticalOffset && { transform: `translateY(${verticalOffset}px)` },
      }}>
        <ImagePhotoGrid {...{
          photos,
          widthArbitrary: innerWidth,
          height: includeHeader
            ? height - 130 - outerMargin * 2
            : height,
          gap: 10,
        }} />
      </div>
    </div>
  );
}
