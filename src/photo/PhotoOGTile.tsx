import {
  Photo,
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { absolutePathForPhotoImage, pathForPhoto } from '@/site/paths';
import OGTile from '@/components/OGTile';

export type OGLoadingState = 'unloaded' | 'loading' | 'loaded' | 'failed';

export default function PhotoOGTile({
  photo,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
  onVisible,
}: {
  photo: Photo
  loadingState?: OGLoadingState
  onLoad?: () => void
  onFail?: () => void
  riseOnHover?: boolean
  retryTime?: number
  onVisible?: () => void
}) {
  return (
    <OGTile {...{
      title: titleForPhoto(photo),
      description: descriptionForPhoto(photo),
      path: pathForPhoto({ photo }),
      pathImageAbsolute: absolutePathForPhotoImage(photo),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
      onVisible,
    }}/>
  );
};
