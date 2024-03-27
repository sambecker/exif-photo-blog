'use client';

import Modal from '@/components/Modal';
import { TbPhotoShare } from 'react-icons/tb';
import { clsx } from 'clsx/lite';
import { BiCopy } from 'react-icons/bi';
import { ReactNode } from 'react';
import { shortenUrl } from '@/utility/url';
import { toastSuccess } from '@/toast';

export default function ShareModal({
  title = 'Share',
  pathShare,
  pathClose,
  children,
}: {
  title?: string
  pathShare: string
  pathClose: string
  children: ReactNode
}) {
  return (
    <Modal onClosePath={pathClose}>
      <div className="space-y-3 md:space-y-4 w-full">
        <div className={clsx(
          'flex items-center gap-x-3',
          'text-2xl leading-snug',
        )}>
          <TbPhotoShare size={22} className="hidden xs:block" />
          <div className="flex-grow">
            {title}
          </div>
        </div>
        {children}
        <div className={clsx(
          'rounded-md',
          'w-full overflow-hidden',
          'flex items-center justify-stretch',
          'border border-gray-200 dark:border-gray-800',
        )}>
          <div className="truncate p-2 w-full">
            {shortenUrl(pathShare)}
          </div>
          <div
            className={clsx(
              'p-3 border-l',
              'border-gray-200 bg-gray-100 active:bg-gray-200',
              // eslint-disable-next-line max-len
              'dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/75 dark:active:bg-gray-900',
              'cursor-pointer',
            )}
            onClick={() => {
              navigator.clipboard.writeText(pathShare);
              toastSuccess('Link to photo copied');
            }}
          >
            <BiCopy size={18} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
