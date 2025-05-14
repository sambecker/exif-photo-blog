'use client';

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
  setUrlAddStatuses?: (urlAddStatuses: UrlAddStatus[]) => void
  isDeleting?: boolean
  setIsDeleting?: (isDeleting: boolean) => void
}) {
  const isComplete = urlAddStatuses.every(({ status }) => status === 'added');
  return (
    <div className="space-y-4">
      {urlAddStatuses.map(status =>
        <AdminUploadsTableRow
          key={status.url}
          {...{
            ...status,
            isAdding,
            isDeleting,
            isComplete,
            setIsDeleting,
            urlAddStatuses,
            setUrlAddStatuses,
          }}
        />,
      )}
    </div>
  );
}
