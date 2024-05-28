'use client';

import ErrorNote from '@/components/ErrorNote';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import InfoBlock from '@/components/InfoBlock';
import LoaderButton from '@/components/primitives/LoaderButton';
import { addAllUploadsAction } from '@/photo/actions';
import { PATH_ADMIN_PHOTOS } from '@/site/paths';
import {
  TagsWithMeta,
  convertTagsForForm,
  getValidationMessageForTags,
} from '@/tag';
import {
  generateLocalNaivePostgresString,
  generateLocalPostgresString,
} from '@/utility/date';
import { readStreamableValue } from 'ai/rsc';
import { clsx } from 'clsx/lite';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { BiImageAdd } from 'react-icons/bi';

export default function AdminAddAllUploads({
  storageUrlCount,
  uniqueTags,
  isAdding,
  setIsAdding,
  onUploadAdded,
}: {
  storageUrlCount: number
  uniqueTags?: TagsWithMeta
  isAdding: boolean
  setIsAdding: (isAdding: boolean) => void
  onUploadAdded?: (addedUploadUrls: string[]) => void
}) {
  const divRef = useRef<HTMLDivElement>(null);

  const [buttonText, setButtonText] = useState('Add All Uploads');
  const [buttonSubheadText, setButtonSubheadText] = useState('');
  const [showTags, setShowTags] = useState(false);
  const [tags, setTags] = useState('');
  const [actionErrorMessage, setActionErrorMessage] = useState('');
  const [tagErrorMessage, setTagErrorMessage] = useState('');

  const router = useRouter();

  return (
    <>
      {actionErrorMessage &&
        <ErrorNote>{actionErrorMessage}</ErrorNote>}
      <InfoBlock padding="tight">
        <div className="w-full space-y-4 py-1">
          <div className="flex">
            <div className={clsx(
              'flex-grow',
              tagErrorMessage ? 'text-error' : 'text-main',
            )}>
              {showTags
                ? tagErrorMessage || 'Add tags to all uploads'
                : `Found ${storageUrlCount} uploads`}
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
            <LoaderButton
              className="primary w-full justify-center"
              isLoading={isAdding}
              disabled={Boolean(tagErrorMessage)}
              icon={<BiImageAdd size={18} className="translate-x-[1px]" />}
              onClick={async () => {
                if (confirm(
                  `Are you sure you want to add all ${storageUrlCount} uploads?`
                )) {
                  setIsAdding(true);
                  try {
                    const stream = await addAllUploadsAction({
                      tags: showTags ? tags : undefined,
                      takenAtLocal: generateLocalPostgresString(),
                      takenAtNaiveLocal: generateLocalNaivePostgresString(),
                    });
                    for await (const data of readStreamableValue(stream)) {
                      setButtonText(data?.headline ?? '');
                      setButtonSubheadText(data?.subhead ?? '');
                      onUploadAdded?.(data?.addedUploadUrls.split(',') ?? []);
                    }
                    router.push(PATH_ADMIN_PHOTOS);
                  } catch (e: any) {
                    setIsAdding(false);
                    setButtonText('Try Again');
                    setActionErrorMessage(e);
                  }
                }
              }}
              hideTextOnMobile={false}
            >
              {buttonText}
            </LoaderButton>
            {buttonSubheadText &&
              <div className="text-dim text-sm text-center">
                {buttonSubheadText}
              </div>}
          </div>
        </div>
      </InfoBlock>
    </>
  );
}
