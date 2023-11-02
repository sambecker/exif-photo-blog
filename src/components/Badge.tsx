import { cc } from '@/utility/css';

export default function Badge({
  children,
  type = 'primary',
  uppercase,
}: {
  children: React.ReactNode
  type?: 'primary' | 'text-only'
  uppercase?: boolean
}) {
  const coreStyles = () => {
    switch (type) {
    case 'primary': return cc(
      'px-1 py-1 leading-none rounded-md',
      'bg-gray-100 dark:bg-gray-800/75',
      'text-gray-500 dark:text-gray-400',
      'font-medium text-[0.7rem] tracking-wide',
    );
    }
  };
  return (
    <span className={cc(
      coreStyles(),
      uppercase && 'uppercase',
    )}>
      {children}
    </span>
  );
}
