'use client';

import Modal from '@/components/Modal';
import PhotoOGTile from '@/photo/PhotoOGTile';
import { absolutePathForPhoto, pathForPhoto } from '@/site/paths';
import { TbPhotoShare } from 'react-icons/tb';
import { cc } from '@/utility/css';
import { BiCopy } from 'react-icons/bi';
import { Photo } from '.';
import { toast } from 'sonner';
import { FiCheckSquare } from 'react-icons/fi';

export default function PhotoModal({
  photo,
  tag,
}: {
  photo: Photo
  tag?: string
}) {
  const shareUrl = absolutePathForPhoto(photo, tag);
  
  return (
    <Modal onClosePath={pathForPhoto(photo, tag)}>
      <div className="space-y-3 md:space-y-4 w-full">
        <div className={cc(
          'flex items-center gap-x-3',
          'text-xl md:text-3xl leading-snug',
        )}>
          <TbPhotoShare size={22} className="hidden xs:block" />
          <div className="flex-grow">
            Share Photo
          </div>
        </div>
        <PhotoOGTile photo={photo} />
        <div className={cc(
          'rounded-md',
          'w-full overflow-hidden',
          'flex items-center justify-stretch',
          'border border-gray-200 dark:border-gray-800',
        )}>
          <div className="truncate p-2">
            {shareUrl}
          </div>
          <div
            className={cc(
              'p-3 border-l',
              'border-gray-200 bg-gray-100 active:bg-gray-200',
              // eslint-disable-next-line max-len
              'dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/75 dark:active:bg-gray-900',
              'cursor-pointer',
            )}
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              toast(
                'Link to photo copied',
                { icon: <FiCheckSquare size={16} /> },
              );
            }}
          >
            <BiCopy size={18} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
