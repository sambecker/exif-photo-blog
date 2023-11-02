import { cc } from '@/utility/css';

export default function Badge({
  children,
  type = 'primary',
  uppercase,
}: {
  children: React.ReactNode
  type?: 'primary' | 'secondary' | 'text-only'
  uppercase?: boolean
}) {
  const baseStyles = () => {
    switch (type) {
    case 'primary': return cc(
      'px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-900',
      'border border-gray-200 dark:border-gray-800'
    );
    case 'secondary': return cc(
      'px-1 py-1 leading-none rounded-md',
      'bg-gray-100 dark:bg-gray-800/75',
      'text-medium',
      'font-medium text-[0.7rem]',
    );
    }
  };
  return (
    <span className={cc(
      baseStyles(),
      uppercase && 'uppercase tracking-wider',
    )}>
      {children}
    </span>
  );
}
