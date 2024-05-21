import { absolutePathForFocalLength, pathForFocalLength } from '@/site/paths';
import { Photo, PhotoDateRange } from '../photo';
import ShareModal from '@/components/ShareModal';
import FocalLengthOGTile from './FocalLengthOGTile';

export default function FocalLengthShareModal({
  focal,
  photos,
  count,
  dateRange,
}: {
  focal: number
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRange
}) {
  return (
    <ShareModal
      title="Share Photos"
      pathShare={absolutePathForFocalLength(focal)}
      pathClose={pathForFocalLength(focal)}
    >
      <FocalLengthOGTile {...{ focal, photos, count, dateRange }} />
    </ShareModal>
  );
};
