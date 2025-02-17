'use client';

import PhotoUpload from '@/photo/PhotoUpload';
import { PATH_ADMIN_PHOTOS } from '@/app/paths';
import { useAppState } from '@/state/AppState';
import Link from 'next/link';
import { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

export default function AdminCTA() {
  const { isUserSignedIn } = useAppState();

  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="flex justify-center pt-4">
      {isUserSignedIn
        ? <PhotoUpload
          showUploadStatus={false}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
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
