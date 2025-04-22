import { absolutePathForFocalLength } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import FocalLengthOGTile from './FocalLengthOGTile';
import { formatFocalLengthSafe, shareTextFocalLength } from '.';

export default function FocalLengthShareModal({
  focal,
  photos,
  count,
  dateRange,
}: {
  focal: number
} & PhotoSetAttributes) {
  return (
    <ShareModal
      pathShare={absolutePathForFocalLength(focal, true)}
      navigatorTitle={formatFocalLengthSafe(focal)}
      socialText={shareTextFocalLength(focal)}
    >
      <FocalLengthOGTile {...{ focal, photos, count, dateRange }} />
    </ShareModal>
  );
};
