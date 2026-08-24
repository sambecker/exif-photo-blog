'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import Link from 'next/link';
import { PATH_ADMIN_TAGS } from '@/app/path';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { ReactNode, useMemo, useState } from 'react';
import {
  renamePhotoTagGloballyAction,
  setTagPhotosVisibilityAction,
} from '@/photo/actions';
import { parameterize } from '@/utility/string';
import { useAppState } from '@/app/AppState';
import { tagVisibilityConfirmationText } from '@/tag';
import { useAppText } from '@/i18n/state/client';
import AdminBulkVisibilityFieldset from './AdminBulkVisibilityFieldset';

export default function AdminTagForm({
  tag,
  count,
  children,
}: {
  tag: string
  count: number
  children?: ReactNode
}) {
  const { invalidateSwr } = useAppState();
  const appText = useAppText();

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
      <AdminBulkVisibilityFieldset
        defaultLabel={appText.admin.setVisibilityForTag}
        getConfirmationText={visibility =>
          tagVisibilityConfirmationText(tag, count, visibility, appText)}
        action={visibility => setTagPhotosVisibilityAction(tag, visibility)}
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
