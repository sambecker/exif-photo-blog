export default function PageContentContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[16rem] sm:min-h-[30rem]">
      {children}
    </div>
  );
}
