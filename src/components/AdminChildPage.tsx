import { ReactNode } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

function AdminChildPage({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <div className="space-y-5">
      <Link href="/admin/photos" className="flex gap-1 items-center">
        <FiArrowLeft size={16} />
        Admin
      </Link>
      <div>
        {children}
      </div>
    </div>
  );
};

export default AdminChildPage;
