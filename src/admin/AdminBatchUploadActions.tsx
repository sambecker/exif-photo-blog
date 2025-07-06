'use client';

import ErrorNote from '@/components/ErrorNote';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import Container from '@/components/Container';
import { addUploadsAction } from '@/photo/actions';
import { PATH_ADMIN_PHOTOS } from '@/app/paths';
import { Tags } from '@/tag';
import {
  generateLocalNaivePostgresString,
  generateLocalPostgresString,
} from '@/utility/date';
import sleep from '@/utility/sleep';
import { readStreamableValue } from 'ai/rsc';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import ProgressButton from '@/components/primitives/ProgressButton';
import { UrlAddStatus } from './AdminUploadsClient';
import PhotoTagFieldset from './PhotoTagFieldset';
import DeleteUploadButton from './DeleteUploadButton';
import { useAppState } from '@/app/AppState';
import { pluralize } from '@/utility/string';
import FieldsetFavs from '@/photo/form/FieldsetFavs';
import FieldsetPrivate from '@/photo/form/FieldsetPrivate';
import IconAddUpload from '@/components/icons/IconAddUpload';
import FieldsetExclude from '@/photo/form/FieldsetExclude';

const UPLOAD_BATCH_SIZE = 2;

export default function AdminBatchUploadActions({
  uploadUrls,
  uploadTitles,
  uniqueTags,
  isAdding,
  setIsAdding,
  setUrlAddStatuses,
  isDeleting,
  setIsDeleting,
  onBatchActionComplete,
}: {
  uploadUrls: string[]
  uploadTitles: string[]
  uniqueTags?: Tags
  isAdding: boolean
  setIsAdding: Dispatch<SetStateAction<boolean>>
  setUrlAddStatuses: Dispatch<SetStateAction<UrlAddStatus[]>>
  isDeleting: boolean
  setIsDeleting: Dispatch<SetStateAction<boolean>>
  onBatchActionComplete?: () => Promise<void>
}) {
  const { updateAdminData } = useAppState();

  const [showBulkSettings, setShowBulkSettings] = useState(false);
  const [tags, setTags] = useState('');
  const [favorite, setFavorite] = useState('false');
  const [excludeFromFeeds, setExcludeFromFeeds] = useState('false');
  const [hidden, setHidden] = useState('false');
  const [tagErrorMessage, setTagErrorMessage] = useState('');

  const [buttonText, setButtonText] = useState('Add All Uploads');
  const [actionErrorMessage, setActionErrorMessage] = useState('');
  const [addingProgress, setAddingProgress] = useState<number>();
  const [isAddingComplete, setIsAddingComplete] = useState(false);

  const router = useRouter();

  const addedUploadCount = useRef(0);
  const addUploadUrls = async (
    urls: string[],
    titles: string[],
    isFinalBatch: boolean,
  ) => {
    try {
      const stream = await addUploadsAction({
        uploadUrls: urls,
        uploadTitles: titles,
        ...showBulkSettings && {
          tags,
          favorite,
          excludeFromFeeds,
          hidden,
        },
        takenAtLocal: generateLocalPostgresString(),
        takenAtNaiveLocal: generateLocalNaivePostgresString(),
        shouldRevalidateAllKeysAndPaths: isFinalBatch,
      });
      for await (const data of readStreamableValue(stream)) {
        setButtonText(
          `Adding ${addedUploadCount.current + 1} of ${uploadUrls.length}`,
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
            uploadUrls.length
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

  useEffect(() => {
    if (hidden === 'true') {
      setFavorite('false');
      setExcludeFromFeeds('false');
    }
  }, [hidden]);

  return (
    <>
      {actionErrorMessage &&
        <ErrorNote>{actionErrorMessage}</ErrorNote>}
      <Container padding="tight" className="p-2! sm:p-3!">
        <div className="w-full space-y-4">
          <div className="flex">
            <div className="grow text-main">
              {showBulkSettings
                ? `Apply to ${pluralize(uploadUrls.length, 'upload')}`
                : `Found ${pluralize(uploadUrls.length, 'upload')}`}
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
                className="relative z-10"
              />
              <div className="flex max-sm:flex-col gap-x-8 gap-y-4">
                <FieldsetFavs
                  value={favorite}
                  onChange={setFavorite}
                  readOnly={isAdding || hidden === 'true'}
                />
                <FieldsetExclude
                  value={excludeFromFeeds}
                  onChange={setExcludeFromFeeds}
                  readOnly={isAdding || hidden === 'true'}
                />
                <FieldsetPrivate
                  value={hidden}
                  onChange={setHidden}
                  readOnly={isAdding}
                />
              </div>
            </div>}
          <div className="flex flex-col sm:flex-row-reverse gap-2">
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
                : <IconAddUpload />
              }
              onClick={async () => {
                // eslint-disable-next-line max-len
                if (confirm(`Are you sure you want to add all ${uploadUrls.length} uploads?`)) {
                  setIsAdding(true);
                  setUrlAddStatuses(current => current.map((url, index) => ({
                    ...url,
                    status: index === 0 ? 'adding' : 'waiting',
                  })));
                  const uploadsToAdd = uploadUrls.slice();
                  const titlesToAdd = uploadTitles.slice();
                  try {
                    while (uploadsToAdd.length > 0) {
                      const nextBatch = uploadsToAdd
                        .splice(0, UPLOAD_BATCH_SIZE);
                      const nextTitles = titlesToAdd
                        .splice(0, UPLOAD_BATCH_SIZE);
                      await addUploadUrls(
                        nextBatch,
                        nextTitles,
                        uploadsToAdd.length === 0,
                      );
                    }
                    setButtonText('Complete');
                    setAddingProgress(1);
                    setIsAdding(false);
                    setIsAddingComplete(true);
                    await onBatchActionComplete?.();
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
              hideText="never"
            >
              {buttonText}
            </ProgressButton>
            <DeleteUploadButton
              urls={uploadUrls}
              onDeleteStart={() => setIsDeleting(true)}
              onDelete={async didFail => {
                if (!didFail) {
                  updateAdminData?.({ uploadsCount: 0 });
                  await onBatchActionComplete?.();
                  router.push(PATH_ADMIN_PHOTOS);
                } else {
                  setIsDeleting(false);
                }
              }}
              className="w-full flex justify-center"
              shouldRedirectToAdminPhotos
              hideText="never"
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
