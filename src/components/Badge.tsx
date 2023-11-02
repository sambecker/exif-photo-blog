import { cc } from '@/utility/css';

export default function Badge({
  children,
  uppercase,
}: {
  children: React.ReactNode
  uppercase?: boolean
}) {
  return (
    <span className={cc(
      'px-1 py-1 leading-none rounded-md',
      'bg-gray-100 dark:bg-gray-800/75',
      'text-gray-500 dark:text-gray-400',
      'font-medium text-[0.7rem] tracking-wide',
      uppercase && 'uppercase',
    )}>
      {children}
    </span>
  );
}
