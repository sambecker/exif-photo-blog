import SiteGrid from '@/components/SiteGrid';
import ThemeSwitcher from '@/site/ThemeSwitcher';
import { cc } from '@/utility/css';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <SiteGrid
        contentMain={<div className={cc(
          'my-8',
          'flex items-center',
          'text-gray-400 dark:text-gray-500',
        )}>
          <div className="flex-grow">
            <Link
              href="/admin/photos"
              className="hover:text-gray-600 dark:hover:text-gray-400"
            >
              Admin
            </Link>
          </div>
          <ThemeSwitcher />
        </div>}
      />
    </>
  );
}