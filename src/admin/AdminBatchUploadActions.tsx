'use client';

import ErrorNote from '@/components/ErrorNote';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import Container from '@/components/Container';
import { addAllUploadsAction } from '@/photo/actions';
import { PATH_ADMIN_PHOTOS } from '@/app/paths';
import { Tags } from '@/tag';
import {
  generateLocalNaivePostgresString,
  generateLocalPostgresString,
} from '@/utility/date';
import sleep from '@/utility/sleep';
import { readStreamableValue } from 'ai/rsc';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { BiCheckCircle, BiImageAdd } from 'react-icons/bi';
import ProgressButton from '@/components/primitives/ProgressButton';
import { UrlAddStatus } from './AdminUploadsClient';
import PhotoTagFieldset from './PhotoTagFieldset';
import DeleteUploadButton from './DeleteUploadButton';
import { useAppState } from '@/state/AppState';
import { pluralize } from '@/utility/string';
import FieldsetFavs from '@/photo/form/FieldsetFavs';
import FieldsetHidden from '@/photo/form/FieldsetHidden';

const UPLOAD_BATCH_SIZE = 4;

export default function AdminBatchUploadActions({
  storageUrls,
  uniqueTags,
  isAdding,
  setIsAdding,
  setUrlAddStatuses,
  isDeleting,
  setIsDeleting,
}: {
  storageUrls: string[]
  uniqueTags?: Tags
  isAdding: boolean
  setIsAdding: Dispatch<SetStateAction<boolean>>
  setUrlAddStatuses: Dispatch<SetStateAction<UrlAddStatus[]>>
  isDeleting: boolean
  setIsDeleting: Dispatch<SetStateAction<boolean>>
}) {
  const { updateAdminData } = useAppState();

  const [showBulkSettings, setShowBulkSettings] = useState(false);
  const [tags, setTags] = useState('');
  const [favorite, setFavorite] = useState('false');
  const [hidden, setHidden] = useState('false');
  const [tagErrorMessage, setTagErrorMessage] = useState('');

  const [buttonText, setButtonText] = useState('Add All Uploads');
  const [actionErrorMessage, setActionErrorMessage] = useState('');
  const [addingProgress, setAddingProgress] = useState<number>();
  const [isAddingComplete, setIsAddingComplete] = useState(false);

  const router = useRouter();

  const addedUploadCount = useRef(0);
  const addUploadUrls = async (uploadUrls: string[], isFinalBatch: boolean) => {
    try {
      const stream = await addAllUploadsAction({
        uploadUrls,
        ...showBulkSettings && {
          tags,
          favorite,
          hidden,
        },
        takenAtLocal: generateLocalPostgresString(),
        takenAtNaiveLocal: generateLocalNaivePostgresString(),
        shouldRevalidateAllKeysAndPaths: isFinalBatch,
      });
      for await (const data of readStreamableValue(stream)) {
        setButtonText(addedUploadCount.current === 0
          ? `Adding 1 of ${storageUrls.length}`
          : `Adding ${addedUploadCount.current + 1} of ${storageUrls.length}`,
        );
        setUrlAddStatuses(current => {
          const update = current.map(status =>
            status.url === data?.url
              ? {
                ...status,
                // Prevent status regressions
                status: status.status !== 'added' ? data.status : 'added',
                statusMessage: data.statusMessage,
                progress: data.progress,
              }
              : status,
          );
          addedUploadCount.current = update
            .filter(({ status }) => status === 'added')
            .length;
          return update;
        });
        setAddingProgress((current = 0) => {
          const updatedProgress = (
            (
              ((addedUploadCount.current || 1) - 1) +
              (data?.progress ?? 0)
            ) /
            storageUrls.length
          ) * 0.95;
          // Prevent out-of-order updates causing progress to go backwards
          return Math.max(current, updatedProgress);
        });
      }
    } catch (e: any) {
      setIsAdding(false);
      setButtonText('Try Again');
      setAddingProgress(undefined);
      setActionErrorMessage(e);
    }
  };

  return (
    <>
      {actionErrorMessage &&
        <ErrorNote>{actionErrorMessage}</ErrorNote>}
      <Container padding="tight">
        <div className="w-full space-y-4 py-1">
          <div className="flex">
            <div className="grow text-main">
              {showBulkSettings
                ? `Apply to ${pluralize(storageUrls.length, 'upload')}`
                : `Found ${pluralize(storageUrls.length, 'upload')}`}
            </div>
            <FieldSetWithStatus
              label="Apply to All"
              type="checkbox"
              value={showBulkSettings ? 'true' : 'false'}
              onChange={value => setShowBulkSettings(value === 'true')}
              readOnly={isAdding}
            />
          </div>
          {showBulkSettings && !actionErrorMessage &&
            <div className="space-y-4 mb-6">
              <PhotoTagFieldset
                label="Tags"
                tags={tags}
                tagOptions={uniqueTags}
                onChange={setTags}
                onError={setTagErrorMessage}
                readOnly={isAdding}
              />
              <div className="flex gap-8">
                <FieldsetFavs
                  value={favorite}
                  onChange={setFavorite}
                  readOnly={isAdding}
                />
                <FieldsetHidden
                  value={hidden}
                  onChange={setHidden}
                  readOnly={isAdding}
                />
              </div>
            </div>}
          <div className="space-y-2">
            <ProgressButton
              primary
              className="w-full justify-center"
              progress={addingProgress}
              isLoading={isAdding}
              disabled={
                Boolean(tagErrorMessage) ||
                isAddingComplete ||
                isDeleting
              }
              icon={isAddingComplete
                ? <BiCheckCircle size={18} className="translate-x-[1px]" />
                : <BiImageAdd
                  size={18}
                  className="translate-x-[1px] translate-y-[2px]"
                />
              }
              onClick={async () => {
                // eslint-disable-next-line max-len
                if (confirm(`Are you sure you want to add all ${storageUrls.length} uploads?`)) {
                  setIsAdding(true);
                  setUrlAddStatuses(current => current.map((url, index) => ({
                    ...url,
                    status: index === 0 ? 'adding' : 'waiting',
                  })));
                  const uploadsToAdd = storageUrls.slice();
                  try {
                    while (uploadsToAdd.length > 0) {
                      const nextBatch = uploadsToAdd
                        .splice(0, UPLOAD_BATCH_SIZE);
                      await addUploadUrls(
                        nextBatch,
                        uploadsToAdd.length === 0,
                      );
                    }
                    setButtonText('Complete');
                    setAddingProgress(1);
                    setIsAdding(false);
                    setIsAddingComplete(true);
                    await sleep(1000).then(() =>
                      router.push(PATH_ADMIN_PHOTOS));
                  } catch (e: any) {
                    setAddingProgress(undefined);
                    setIsAdding(false);
                    setButtonText('Try Again');
                    setActionErrorMessage(e);
                  }
                }
              }}
              hideTextOnMobile={false}
            >
              {buttonText}
            </ProgressButton>
            <DeleteUploadButton
              urls={storageUrls}
              onDeleteStart={() => setIsDeleting(true)}
              onDelete={didFail => {
                if (!didFail) {
                  updateAdminData?.({ uploadsCount: 0 });
                  router.push(PATH_ADMIN_PHOTOS);
                } else {
                  setIsDeleting(false);
                }
              }}
              className="w-full flex justify-center"
              shouldRedirectToAdminPhotos
              hideTextOnMobile={false}
              disabled={isAdding}
            >
              Delete All Uploads
            </DeleteUploadButton>
          </div>
        </div>
      </Container>
    </>
  );
}
