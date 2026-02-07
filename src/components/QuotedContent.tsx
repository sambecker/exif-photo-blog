import clsx from 'clsx/lite';

export default function QuotedContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={clsx(
    'relative pl-4',
    'before:content-[""] before:absolute',
    'before:left-0 before:top-1 before:bottom-1',
    'before:w-0.5 before:rounded-full',
    'before:bg-medium',
    className,
  )}>
    {children}
  </div>;
}
