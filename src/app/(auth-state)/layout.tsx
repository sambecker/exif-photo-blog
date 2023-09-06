import AuthNav from '@/components/AuthNav';
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
        <AuthNav />
      </div>
    </SessionProvider>
  );
}
