import { absolutePathForFocalLength } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import FocalLengthOGTile from './FocalLengthOGTile';
import { formatFocalLengthSafe, shareTextFocalLength } from '.';
import { getAppText } from '@/i18n/state/server';

export default async function FocalLengthShareModal({
  focal,
  photos,
  count,
  dateRange,
}: {
  focal: number
} & PhotoSetAttributes) {
  const appText = await getAppText();
  return (
    <ShareModal
      pathShare={absolutePathForFocalLength(focal, true)}
      navigatorTitle={formatFocalLengthSafe(focal)}
      socialText={shareTextFocalLength(focal, appText)}
    >
      <FocalLengthOGTile {...{ focal, photos, count, dateRange }} />
    </ShareModal>
  );
};
