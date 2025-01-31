import Spinner from '@/components/Spinner';
import clsx from 'clsx/lite';
import Link from 'next/link';
import { BiLogoGithub } from 'react-icons/bi';

export default function GitHubForkStatusBadgeClient({
  url,
  label,
  style = 'mono',
  title,
}: {
  url?: string
  label?: string
  style?: 'success' | 'warning' | 'mono'
  title?: string
}) {
  const classNameForStyle = () => {
    switch (style) {
    case 'success': return clsx(
      'text-green-700 hover:text-green-700',
      'dark:text-green-400 dark:hover:text-green-400',
      'bg-green-100/75 dark:bg-green-900/50',
      'border-green-300/25',
    );
    case 'warning': return clsx(
      'text-amber-700 hover:text-amber-700',
      'dark:text-amber-400 dark:hover:text-amber-400',
      'bg-amber-100/75 dark:bg-amber-900/50',
      'border-amber-300/25 dark:border-amber-900',
    );
    default: return clsx(
      'text-gray-700 hover:text-gray-700',
      'dark:text-gray-300 dark:hover:text-gray-300',
      'bg-gray-100/75 dark:bg-gray-900/50',
      'border-main',
    );
    }
  };

  const className = clsx(
    'inline-flex items-center gap-2',
    'border transition-colors',
    url ? 'hover:underline' : 'select-none',
    'pl-[4.5px] pr-2 py-[3px]',
    'rounded-full',
    classNameForStyle(),
  );

  const content = <>
    {!label
      ? <Spinner
        color="text"
        className="translate-x-[3px]"
      />
      : <BiLogoGithub size={17} />}
    {label ?? 'Checking'}
  </>;

  return url
    ? <Link
      target="_blank"
      href={url}
      title={title}
      className={className}
    >
      {content}
    </Link>
    : <span
      title={title}
      className={className}
    >
      {content}
    </span>;
}
