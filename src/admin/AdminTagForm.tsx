'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import Link from 'next/link';
import { PATH_ADMIN_TAGS } from '@/app/path';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { ReactNode, useMemo, useState } from 'react';
import { renamePhotoTagGloballyAction } from '@/photo/actions';
import { parameterize } from '@/utility/string';
import { useAppState } from '@/app/AppState';

export default function AdminTagForm({
  tag,
  children,
}: {
  tag: string
  children?: ReactNode
}) {
  const { invalidateSwr } = useAppState();

  const [updatedTagRaw, setUpdatedTagRaw] = useState(tag);

  const updatedTag = useMemo(() =>
    parameterize(updatedTagRaw)
  , [updatedTagRaw]);

  const isFormValid = (
    updatedTag &&
    updatedTag !== tag
  );

  return (
    <form
      action={renamePhotoTagGloballyAction}
      className="space-y-8"
    >
      <FieldsetWithStatus
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
      {children}
      <div className="flex gap-3">
        <Link
          className="button"
          href={PATH_ADMIN_TAGS}
        >
          Cancel
        </Link>
        <SubmitButtonWithStatus
          disabled={!isFormValid}
          onFormSubmit={invalidateSwr}
        >
          Update
        </SubmitButtonWithStatus>
      </div>
    </form>
  );
}
