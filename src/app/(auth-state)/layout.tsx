import AuthNav from '@/components/AuthNav';
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      {children}
      <div className="my-8">
        <AuthNav />
      </div>
    </ClerkProvider>
  );
}
