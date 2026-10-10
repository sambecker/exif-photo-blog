import { clsx } from 'clsx/lite';

export default function LibraryDescription({
  html,
  className,
}: {
  html: string
  className?: string
}) {
  return (
    <div
      className={clsx('text-medium [&>*>a]:underline', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
