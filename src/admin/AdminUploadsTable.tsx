'use client';

import { Dispatch, SetStateAction } from 'react';
import { UrlAddStatus } from './AdminUploadsClient';
import AdminUploadsTableRow from './AdminUploadsTableRow';

export default function AdminUploadsTable({
  isAdding,
  urlAddStatuses,
  setUrlAddStatuses,
  isDeleting,
  setIsDeleting,
}: {
  isAdding?: boolean
  urlAddStatuses: UrlAddStatus[]
  setUrlAddStatuses?: Dispatch<SetStateAction<UrlAddStatus[]>>
  isDeleting?: boolean
  setIsDeleting?: Dispatch<SetStateAction<boolean>>
}) {
  const isComplete = urlAddStatuses.every(({ status }) => status === 'added');
  return (
    <div className="space-y-4">
      {urlAddStatuses.map((status, index) =>
        <AdminUploadsTableRow
          key={status.url}
          {...{
            ...status,
            tabIndex: index + 1,
            shouldRedirectAfterAction: urlAddStatuses.length <= 1,
            isAdding,
            isDeleting,
            isComplete,
            setIsDeleting,
            setUrlAddStatuses,
          }}
        />,
      )}
    </div>
  );
}
