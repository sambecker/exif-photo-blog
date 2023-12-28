import FooterStatic from '@/site/FooterStatic';
import PageContentContainer from '@/components/PageContentContainer';
import { Suspense } from 'react';
import PageSpinner from '@/components/PageSpinner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageContentContainer>
        <Suspense fallback={<PageSpinner />}>
          {children}
        </Suspense>
      </PageContentContainer>
      <FooterStatic />
    </>
  );
}