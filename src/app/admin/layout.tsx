import AdminNav from '@/admin/AdminNav';
import AdminNavClient from '@/admin/AdminNavClient';
import { Suspense } from 'react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mt-4 space-y-5">
      <Suspense fallback={<AdminNavClient items={[{
        label: 'Photos',
        count: 0,
        href: '/admin/photos',
      }]} />}>
        <AdminNav />
      </Suspense>
      {children}
    </div>
  );
}
