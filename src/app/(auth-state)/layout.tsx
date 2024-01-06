import FooterAuth from '@/site/FooterAuth';
import PageContentContainer from '@/components/PageContentContainer';
import { auth } from '@/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  return (
    <>
      <PageContentContainer>
        {children}
      </PageContentContainer>
      <FooterAuth email={session?.user?.email} />
    </>
  );
}
