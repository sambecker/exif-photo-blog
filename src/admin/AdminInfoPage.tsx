import { ReactNode } from 'react';
import AdminPage from './AdminPage';
import AdminInfoNav from './AdminInfoNav';
import ClearCacheButton from './ClearCacheButton';
import { getPhotosMetaCached } from '@/photo/cache';

export default async function AdminInfoPage({
  children,
  contentSide,
}: {
  children: ReactNode
  contentSide?: ReactNode
}) {
  const includeInsights = await getPhotosMetaCached({ hidden: 'include' })
    .then(({ count }) => count > 0)
    .catch(() => false);

  return (
    <AdminPage
      nav={<AdminInfoNav {...{ includeInsights }} />}
      accessory={<ClearCacheButton />}
      contentSide={contentSide}
      contained
    >
      {children}
    </AdminPage>
  );
}
