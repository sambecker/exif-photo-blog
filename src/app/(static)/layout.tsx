import FooterStatic from '@/components/FooterStatic';
import PageContentContainer from '@/components/PageContentContainer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageContentContainer>
        {children}
      </PageContentContainer>
      <FooterStatic />
    </>
  );
}