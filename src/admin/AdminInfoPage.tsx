import Container from '@/components/Container';
import AppGrid from '@/components/AppGrid';
import { ReactNode } from 'react';

export default function AdminInfoPage({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AppGrid
      contentMain={
        <Container spaceChildren={false}>
          {children}
        </Container>}
    />
  );
}
