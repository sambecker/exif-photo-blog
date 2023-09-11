import FooterStatic from '@/components/FooterStatic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <FooterStatic />
    </>
  );
}