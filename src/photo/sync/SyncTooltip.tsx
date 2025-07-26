import clsx from 'clsx/lite';
import { getPhotoSyncStatusText } from '.';
import Tooltip from '@/components/Tooltip';
import { Photo } from '..';

export default function SyncTooltip({
  photo,
}: {
  photo: Photo
}) {
  return (
    <Tooltip
      content={getPhotoSyncStatusText(photo)}
      classNameTrigger={clsx(
        'text-blue-600 dark:text-blue-400',
        'translate-y-[0.5px]',
      )}
      supportMobile
    />
  );
}
