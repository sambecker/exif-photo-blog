import { cc } from '@/utility/css';

export default function Checklist({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div>
      {title &&
        <div className={cc(
          'font-bold dark:text-gray-300',
          'pl-4 mb-2',
        )}>
          {title}
        </div>}
      <div className={cc(
        'bg-white dark:bg-black',
        'dark:text-gray-400',
        'border border-gray-200 dark:border-gray-800 rounded-md',
        'divide-y divide-gray-200 dark:divide-gray-800',
      )}>
        {children}
      </div>
    </div>
  );
}
