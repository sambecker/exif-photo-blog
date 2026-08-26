'use client';

import IconLock from '@/components/icons/IconLock';
import { Photo } from '..';
import IconHidden from '@/components/icons/IconHidden';
import Tooltip from '@/components/Tooltip';
import { useAppText } from '@/i18n/state/client';

export default function PhotoVisibilityIcon({
  photo,
}: {
  photo: Photo
}) {
  const appText = useAppText();

  return photo.hidden
    ? <Tooltip content={appText.admin.visibilityPrivateNote} supportMobile>
      <IconLock size={13} />
    </Tooltip>
    : photo.excludeFromFeeds
      ? <Tooltip content={appText.admin.visibilityExcludeNote} supportMobile>
        <IconHidden size={16} className="translate-y-[0.5px]" />
      </Tooltip>
      : null;
}
