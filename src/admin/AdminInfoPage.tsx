import Container from '@/components/Container';
import AppGrid from '@/components/AppGrid';
import { ComponentProps } from 'react';

export default function AdminInfoPage({
  children,
  ...props
}: Omit<ComponentProps<typeof AppGrid>, 'contentMain'>) {
  return (
    <AppGrid
      {...props}
      contentMain={
        <Container spaceChildren={false}>
          {children}
        </Container>}
    />
  );
}
