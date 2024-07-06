'use client';

import ImageSmall from '@/components/image/ImageSmall';
import Spinner from '@/components/Spinner';
import { getIdFromStorageUrl } from '@/services/storage';
import { clsx } from 'clsx/lite';
import { motion } from 'framer-motion';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { pathForAdminUploadUrl } from '@/site/paths';
import AddButton from './AddButton';
import FormWithConfirm from '@/components/FormWithConfirm';
import { deleteBlobPhotoAction } from '@/photo/actions';
import DeleteButton from './DeleteButton';
import { AddedUrlStatus } from './AdminUploadsClient';
import ResponsiveDate from '@/components/ResponsiveDate';

export default function AdminUploadsTable({
  isAdding,
  urls,
}: {
  isAdding?: boolean
  urls: AddedUrlStatus[]
}) {
  const isComplete = urls.every(({ status }) => status === 'added');

  return (
    <div className="space-y-4">
      {urls.map(({ url, status, statusMessage, uploadedAt }) => {
        const addUploadPath = pathForAdminUploadUrl(url);
        return <div key={url}>
          <div className={clsx(
            'flex items-center gap-2 w-full min-h-8',
          )}>
            <motion.div
              className="flex items-center grow gap-2"
              animate={isAdding
                ? {
                  opacity: status === 'adding' || isComplete ? 1 : 0.5,
                  translateX: isComplete
                    ? 0
                    : status === 'adding' || isComplete ? -4 : 4,
                }
                : { opacity: 1, translateX: 0 }}
            >
              <ImageSmall
                src={url}
                alt={url}
                aspectRatio={3.0 / 2.0}
                className="rounded-[3px] overflow-hidden shrink-0"
              />
              <span className="grow min-w-0">
                <div className="overflow-hidden text-ellipsis">
                  {getIdFromStorageUrl(url)}
                </div>
                <div className="text-dim overflow-hidden text-ellipsis">
                  {isAdding || isComplete
                    ? status === 'added'
                      ? 'Complete'
                      : status === 'adding'
                        ? statusMessage ?? 'Adding ...'
                        : 'Waiting'
                    : uploadedAt
                      ? <ResponsiveDate date={uploadedAt} />
                      : '—'}
                </div>
              </span>
            </motion.div>
            <span className="flex items-center gap-2">
              {isAdding || isComplete
                ? <>
                  {status === 'added'
                    ? <FaRegCircleCheck size={18} />
                    : status === 'adding'
                      ? <Spinner
                        size={19}
                        className="translate-y-[2px]"
                      />
                      : <span className="pr-1.5 text-dim">
                        —
                      </span>}
                </>
                : <>
                  <AddButton path={addUploadPath} />
                  <FormWithConfirm
                    action={deleteBlobPhotoAction}
                    confirmText="Are you sure you want to delete this upload?"
                  >
                    <input
                      type="hidden"
                      name="redirectToPhotos"
                      value={urls.length < 2 ? 'true' : 'false'}
                      readOnly
                    />
                    <input
                      type="hidden"
                      name="url"
                      value={url}
                      readOnly
                    />
                    <DeleteButton />
                  </FormWithConfirm>
                </>}
            </span>
          </div>
        </div>;
      })}
    </div>
  );
}