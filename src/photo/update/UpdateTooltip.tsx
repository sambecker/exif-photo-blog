import clsx from 'clsx/lite';
import { getPhotoUpdateStatusText } from '.';
import Tooltip from '@/components/Tooltip';
import { Photo } from '..';

export default function UpdateTooltip({
  photo,
}: {
  photo: Photo
}) {
  return (
    <Tooltip
      content={getPhotoUpdateStatusText(photo)}
      classNameTrigger={clsx(
        'text-blue-600 dark:text-blue-400',
        'translate-y-[0.5px]',
      )}
      supportMobile
    />
  );
}
