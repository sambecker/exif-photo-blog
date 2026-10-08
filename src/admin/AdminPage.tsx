import { ComponentProps, ReactNode } from 'react';
import { clsx } from 'clsx/lite';
import AppGrid from '@/components/AppGrid';
import Container from '@/components/Container';
import AdminPageHeader from './AdminPageHeader';

export default function AdminPage({
  children,
  contentSide,
  contained,
  className,
  ...headerProps
}: ComponentProps<typeof AdminPageHeader> & {
  children: ReactNode
  contentSide?: ReactNode
  contained?: boolean
}) {
  const hasBreadcrumb = Boolean(headerProps.backPath || headerProps.breadcrumb);

  return (
    <div className={clsx(
      hasBreadcrumb ? 'space-y-5' : 'space-y-2',
      className,
    )}>
      {/* Separate grid keeps side content aligned with main content */}
      <AppGrid contentMain={<AdminPageHeader {...headerProps} />} />
      <AppGrid
        contentMain={contained
          ? <Container spaceChildren={false}>
            {children}
          </Container>
          : children}
        contentSide={contentSide}
      />
    </div>
  );
}
