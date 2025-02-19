import Container from '@/components/Container';
import SiteGrid from '@/components/SiteGrid';
import clsx from 'clsx/lite';
import { ReactNode } from 'react';

export default function AdminInfoPage({
  title,
  accessory,
  children,
}: {
  title: string
  accessory?: ReactNode
  children: ReactNode
}) {
  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          <div className="flex items-center gap-4 min-h-9">
            <div className="grow">
              {title}
            </div>
            {accessory}
          </div>
          <Container spaceChildren={false}>
            <div className={clsx(
              'max-w-xl w-full',
              'space-y-6 md:space-y-8',
            )}>
              {children}
            </div>
          </Container>
        </div>}
    />
  );
}
