'use client';

import PhotoUploadWithStatus from '@/photo/PhotoUploadWithStatus';
import { PATH_ADMIN_PHOTOS } from '@/app/paths';
import { useAppState } from '@/state/AppState';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function AdminCTA({
  shouldResize,
  onLastUpload,
}: {
  shouldResize: boolean
  onLastUpload: () => Promise<void>
}) {
  const { isUserSignedIn } = useAppState();

  return (
    <div className="flex justify-center pt-4">
      {isUserSignedIn
        ? <PhotoUploadWithStatus
          inputId="admin-cta"
          shouldResize={shouldResize}
          onLastUpload={onLastUpload}
          showStatusText={false}
        />
        : <Link
          href={PATH_ADMIN_PHOTOS}
          className="button primary"
        >
          <span>Admin Dashboard</span>
          <FaArrowRight size={10} />
        </Link>}
    </div>
  );
}
