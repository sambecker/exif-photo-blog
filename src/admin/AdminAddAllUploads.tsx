'use client';

import ErrorNote from '@/components/ErrorNote';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import Container from '@/components/Container';
import { addAllUploadsAction } from '@/photo/actions';
import { PATH_ADMIN_PHOTOS } from '@/site/paths';
import {
  Tags,
  convertTagsForForm,
  getValidationMessageForTags,
} from '@/tag';
import {
  generateLocalNaivePostgresString,
  generateLocalPostgresString,
} from '@/utility/date';
import sleep from '@/utility/sleep';
import { readStreamableValue } from 'ai/rsc';
import { clsx } from 'clsx/lite';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { BiCheckCircle, BiImageAdd } from 'react-icons/bi';
import ProgressButton from '@/components/primitives/ProgressButton';
import { UrlAddStatus } from './AdminUploadsClient';

const UPLOAD_BATCH_SIZE = 4;

export default function AdminAddAllUploads({
  storageUrls,
  uniqueTags,
  isAdding,
  setIsAdding,
  setUrlAddStatuses,
}: {
  storageUrls: string[]
  uniqueTags?: Tags
  isAdding: boolean
  setIsAdding: (isAdding: boolean) => void
  setUrlAddStatuses: Dispatch<SetStateAction<UrlAddStatus[]>>
}) {
  const divRef = useRef<HTMLDivElement>(null);

  const [buttonText, setButtonText] = useState('Add All Uploads');
  const [showTags, setShowTags] = useState(false);
  const [tags, setTags] = useState('');
  const [actionErrorMessage, setActionErrorMessage] = useState('');
  const [tagErrorMessage, setTagErrorMessage] = useState('');
  const [addingProgress, setAddingProgress] = useState<number>();
  const [isAddingComplete, setIsAddingComplete] = useState(false);

  const router = useRouter();

  const addedUploadCount = useRef(0);
  const addUploadUrls = async (uploadUrls: string[]) => {
    try {
      const stream = await addAllUploadsAction({
        uploadUrls,
        tags: showTags ? tags : undefined,
        takenAtLocal: generateLocalPostgresString(),
        takenAtNaiveLocal: generateLocalNaivePostgresString(),
      });
      for await (const data of readStreamableValue(stream)) {
        setButtonText(addedUploadCount.current === 0
          ? `Adding 1 of ${storageUrls.length}`
          : `Adding ${addedUploadCount.current + 1} of ${storageUrls.length}`
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
              : status
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
            <div className={clsx(
              'flex-grow',
              tagErrorMessage ? 'text-error' : 'text-main',
            )}>
              {showTags
                ? tagErrorMessage || 'Add tags to all uploads'
                : `Found ${storageUrls.length} uploads`}
            </div>
            <FieldSetWithStatus
              id="show-tags"
              label="Apply tags"
              type="checkbox"
              value={showTags ? 'true' : 'false'}
              onChange={value => {
                setShowTags(value === 'true');
                if (value === 'true') {
                  setTimeout(() =>
                    divRef.current?.querySelectorAll('input')[0]?.focus()
                  , 100);
                }
              }}
              readOnly={isAdding}
            />
          </div>
          <div
            ref={divRef}
            className={showTags && !actionErrorMessage ? undefined : 'hidden'}
          >
            <FieldSetWithStatus
              id="tags"
              label="Optional Tags"
              tagOptions={convertTagsForForm(uniqueTags)}
              value={tags}
              onChange={tags => {
                setTags(tags);
                setTagErrorMessage(getValidationMessageForTags(tags) ?? '');
              }}
              readOnly={isAdding}
              error={tagErrorMessage}
              required={false}
              hideLabel
            />
          </div>
          <div className="space-y-2">
            <ProgressButton
              primary
              className="w-full justify-center"
              progress={addingProgress}
              isLoading={isAdding}
              disabled={Boolean(tagErrorMessage) || isAddingComplete}
              icon={isAddingComplete
                ? <BiCheckCircle size={18} className="translate-x-[1px]" />
                : <BiImageAdd size={18} className="translate-x-[1px]" />
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
                      await addUploadUrls(
                        uploadsToAdd.splice(0, UPLOAD_BATCH_SIZE),
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
          </div>
        </div>
      </Container>
    </>
  );
}
