import FooterAuth from '@/site/FooterAuth';
import PageContentContainer from '@/components/PageContentContainer';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <PageContentContainer>
        {children}
      </PageContentContainer>
      <FooterAuth />
    </SessionProvider>
  );
}
