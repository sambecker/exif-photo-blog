import AdminNav from '@/admin/AdminNav';
import AdminNavClient from '@/admin/AdminNavClient';
import { Suspense } from 'react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mt-4 space-y-4">
      <Suspense fallback={<AdminNavClient items={[]} />}>
        <AdminNav />
      </Suspense>
      {children}
    </div>
  );
}
