'use client';

import Modal from '@/components/Modal';
import { TbPhotoShare } from 'react-icons/tb';
import { clsx } from 'clsx/lite';
import { BiCopy } from 'react-icons/bi';
import { JSX, ReactNode } from 'react';
import { shortenUrl } from '@/utility/url';
import { toastSuccess } from '@/toast';
import { PiXLogo } from 'react-icons/pi';
import { SHOW_SOCIAL } from '@/site/config';
import { generateXPostText } from '@/utility/social';
import { useAppState } from '@/state/AppState';
import useOnPathChange from '@/utility/useOnPathChange';

export default function ShareModal({
  title,
  pathShare,
  socialText,
  children,
}: {
  title?: string
  pathShare: string
  socialText: string
  children: ReactNode
}) {
  const { setShareModalProps } = useAppState();

  const renderIcon = (
    icon: JSX.Element,
    action: () => void,
    embedded?: boolean,
  ) =>
    <div
      className={clsx(
        'py-3 px-3.5',
        embedded ? 'border-l' : 'border rounded-md',
        'border-gray-200 bg-gray-50 active:bg-gray-100',
        // eslint-disable-next-line max-len
        'dark:border-gray-800 dark:bg-gray-900/75 dark:hover:bg-gray-800/75 dark:active:bg-gray-900',
        'cursor-pointer',
      )}
      onClick={action}
    >
      {icon}
    </div>;

  useOnPathChange(() => setShareModalProps?.(undefined));

  return (
    <Modal onClose={() => setShareModalProps?.(undefined)}>
      <div className="space-y-3 md:space-y-4 w-full">
        {title &&
          <div className={clsx(
            'flex items-center gap-x-3',
            'text-2xl leading-snug',
          )}>
            <TbPhotoShare size={22} className="hidden xs:block" />
            <div className="flex-grow">
              {title}
            </div>
          </div>}
        {children}
        <div className="flex items-center gap-2">
          <div className={clsx(
            'rounded-md',
            'w-full overflow-hidden',
            'flex items-center justify-stretch',
            'border border-gray-200 dark:border-gray-800',
          )}>
            <div className="truncate p-2 w-full">
              {shortenUrl(pathShare)}
            </div>
            {renderIcon(
              <BiCopy size={18} />,
              () => {
                navigator.clipboard.writeText(pathShare);
                toastSuccess('Link to photo copied');
              },
              true,
            )}
          </div>
          {SHOW_SOCIAL &&
            renderIcon(
              <PiXLogo size={18} />,
              () => window.open(
                generateXPostText(pathShare, socialText),
                '_blank',
              ),
            )}
        </div>
      </div>
    </Modal>
  );
};
