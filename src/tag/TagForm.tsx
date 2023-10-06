'use client';

import { photoQuantityText } from '@/photo';
import PhotoTag from './PhotoTag';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import Link from 'next/link';
import { PATH_ADMIN_TAGS } from '@/site/paths';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import { useMemo, useState } from 'react';
import { renamePhotoTagGloballyAction } from '@/photo/actions';
import { parameterize } from '@/utility/string';

export default function TagForm({
  tag,
  count,
}: {
  tag: string
  count: number
}) {
  const [updatedTagRaw, setUpdatedTagRaw] = useState(tag);

  const updatedTag = useMemo(() =>
    parameterize(updatedTagRaw)
  , [updatedTagRaw]);

  const isFormValid = (
    updatedTag &&
    updatedTag !== tag
  );

  return (
    <div className="space-y-8 max-w-[38rem]">
      <div className="flex item gap-2">
        <PhotoTag {...{ tag }} />
        <div className="text-dim uppercase">
          {photoQuantityText(count, false)}
        </div>
      </div>
      <form
        action={renamePhotoTagGloballyAction}
        className="space-y-11"
      >
        <FieldSetWithStatus
          id="updatedTagRaw"
          label="New Tag Name"
          value={updatedTagRaw}
          onChange={setUpdatedTagRaw}
        />
        {/* Form data: tag to be replaced */}
        <input
          name="tag"
          value={tag}
          hidden
          readOnly
        />
        {/* Form data: updated tag */}
        <input
          name="updatedTag"
          value={updatedTag}
          hidden
          readOnly
        />
        <div className="flex gap-3">
          <Link
            className="button"
            href={PATH_ADMIN_TAGS}
          >
            Cancel
          </Link>
          <SubmitButtonWithStatus
            disabled={!isFormValid}
          >
            Update
          </SubmitButtonWithStatus>
        </div>
      </form>
    </div>
  );
}
