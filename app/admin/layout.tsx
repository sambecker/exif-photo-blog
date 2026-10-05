import AdminNav from '@/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="sm:mt-2 space-y-2">
      <AdminNav />
      {children}
    </div>
  );
}
