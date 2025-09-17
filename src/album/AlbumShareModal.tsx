import { absolutePathForAlbum } from '@/app/path';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import { useAppText } from '@/i18n/state/client';
import AlbumOGTile from '@/tag/AlbumOGTile';
import { Album, shareTextForAlbum } from '.';

export default function AlbumShareModal({
  album,
  photos,
  count,
  dateRange,
}: {
  album: Album
} & PhotoSetAttributes) {
  const appText = useAppText();
  return (
    <ShareModal
      pathShare={absolutePathForAlbum(album, true)}
      navigatorTitle={album.title}
      socialText={shareTextForAlbum(album, appText)}
    >
      <AlbumOGTile {...{ album, photos, count, dateRange }} />
    </ShareModal>
  );
};
