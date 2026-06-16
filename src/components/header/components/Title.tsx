import { FC } from 'react';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { PATH_ROOT } from '@/app/path';

const Title: FC<{
  navTitle: string;
  navCaption?: string;
}> = ({ navTitle, navCaption }) => {
  return (
    <div className={clsx('w-1/2 text-left min-w-0')}>
      <div className='appName truncate overflow-hidden select-none text-[25px] flex items-center'>
        <Link href={PATH_ROOT}>{navTitle}</Link>
      </div>
      {navCaption && (
        <div
          className={clsx(
            'hidden sm:block truncate overflow-hidden',
            'leading-tight text-dim',
          )}
        >
          {navCaption}
        </div>
      )}
    </div>
  );
};

export default Title;
