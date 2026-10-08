'use client';

import { useState } from 'react';
import AdminAlbumForm from '@/admin/AdminAlbumForm';
import { PATH_ADMIN_ALBUMS } from '@/app/path';
import AdminPage from '@/admin/AdminPage';

export default function AdminAlbumCreateClient({
  hasLocationServices,
}: {
  hasLocationServices?: boolean
}) {
  const [title, setTitle] = useState('');

  return (
    <AdminPage
      backPath={PATH_ADMIN_ALBUMS}
      backLabel="Albums"
      breadcrumb={title.trim() ? title : 'Create Album'}
      breadcrumbEllipsis
    >
      <AdminAlbumForm
        hasLocationServices={hasLocationServices}
        mode="create"
        onTitleChange={setTitle}
      />
    </AdminPage>
  );
}
