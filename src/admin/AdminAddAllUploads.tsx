'use client';

import ErrorNote from '@/components/ErrorNote';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import InfoBlock from '@/components/InfoBlock';
import LoaderButton from '@/components/primitives/LoaderButton';
import { addAllUploads } from '@/photo/actions';
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
import { convertStringToArray } from '@/utility/string';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { BiImageAdd } from 'react-icons/bi';

export default function AdminAddAllUploads({
  storageUrlCount,
  uniqueTags,
}: {
  storageUrlCount: number
  uniqueTags?: TagsWithMeta
}) {
  const divRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
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
            />
          </div>
          <div
            ref={divRef}
            className={showTags ? undefined : 'hidden'}
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
              error={tagErrorMessage}
              required={false}
              hideLabel
            />
          </div>
          <div>
            <LoaderButton
              className="primary w-full justify-center"
              isLoading={isLoading}
              disabled={Boolean(tagErrorMessage)}
              icon={<BiImageAdd size={18} className="translate-x-[1px]" />}
              onClick={() => {
                if (confirm(
                  `Are you sure you want to add all ${storageUrlCount} uploads?`
                )) {
                  setIsLoading(true);
                  addAllUploads({
                    tags: showTags && tags
                      ? convertStringToArray(tags) ?? []
                      : [],
                    takenAtLocal: generateLocalPostgresString(),
                    takenAtNaiveLocal: generateLocalNaivePostgresString(),
                  })
                    .then(() =>
                      router.push(PATH_ADMIN_PHOTOS))
                    .catch(e => {
                      setIsLoading(false);
                      setActionErrorMessage(e.message);
                    });
                }
              }}
              hideTextOnMobile={false}
            >
              Add all {storageUrlCount} uploads
            </LoaderButton>
          </div>
        </div>
      </InfoBlock>
    </>
  );
}
