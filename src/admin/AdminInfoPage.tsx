import Container from '@/components/Container';
import SiteGrid from '@/components/SiteGrid';
import { ReactNode } from 'react';

export default function AdminInfoPage({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SiteGrid
      contentMain={
        <Container spaceChildren={false}>
          {children}
        </Container>}
    />
  );
}
