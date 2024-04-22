import AdminNav from '@/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mt-4 space-y-5">
      <AdminNav />
      {children}
    </div>
  );
}
