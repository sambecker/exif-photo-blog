import Link from 'next/link';
import { cc } from '@/utility/css';

export default function SwitcherItem({
  icon,
  href,
  className: classNameProp,
  onClick,
  active,
  noPadding,
}: {
  icon: JSX.Element
  href?: string
  className?: string
  onClick?: () => void
  active?: boolean
  noPadding?: boolean
}) {
  const className = cc(
    classNameProp,
    'py-0.5 px-1.5',
    'cursor-pointer',
    'hover:bg-gray-50 active:bg-gray-100 active:text-gray-400',
    // eslint-disable-next-line max-len
    'dark:hover:bg-gray-950 dark:active:bg-gray-900/75 dark:active:text-gray-600',
    active
      ? 'text-black dark:text-white'
      : 'text-gray-300 dark:text-gray-700',
  );

  const renderIcon = () => noPadding
    ? icon
    : <div className="w-[28px] h-[24px] flex items-center justify-center">
      {icon}
    </div>;

  return (
    href
      ? <Link {...{ href, className }}>{renderIcon()}</Link>
      : <div {...{ onClick, className }}>{renderIcon()}</div>
  );
};
