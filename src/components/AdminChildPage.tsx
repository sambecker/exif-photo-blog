import { ReactNode } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

function AdminChildPage({
  backPath,
  backLabel,
  children,
}: {
  backPath?: string
  backLabel?: string
  children: ReactNode,
}) {
  return (
    <div className="space-y-8">
      {backPath &&
        <Link
          href={backPath}
          className="flex gap-1 items-center"
        >
          <FiArrowLeft size={16} />
          {backLabel || 'Back'}
        </Link>}
      <div>
        {children}
      </div>
    </div>
  );
};

export default AdminChildPage;
