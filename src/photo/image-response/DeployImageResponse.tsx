import { Photo } from '..';
import PhotoGridImageResponse from './PhotoGridImageResponse';
import IconFullFrame from '@/icons/IconFullFrame';
import IconGrid from '@/icons/IconGrid';

export default function DeployImageResponse({
  photos,
  request,
  width,
  height,
  fontFamily,
  outerMargin = 50,
  darkMode = true,
}: {
  photos: Photo[]
  request: Request
  width: number
  height: number
  fontFamily: string
  outerMargin?: number
  darkMode?: boolean
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
      </div>
      <PhotoGridImageResponse {...{
        photos,
        request,
        colCount: 4,
        rowCount: 4,
        width: innerWidth,
      }} />
    </div>
  );
}
