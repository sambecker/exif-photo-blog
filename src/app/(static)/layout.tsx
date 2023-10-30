import FooterStatic from '@/site/FooterStatic';
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