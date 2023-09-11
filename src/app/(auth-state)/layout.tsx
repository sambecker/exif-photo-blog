import FooterAuth from '@/components/FooterAuth';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      {children}
      <div className="my-8">
        <FooterAuth />
      </div>
    </SessionProvider>
  );
}
