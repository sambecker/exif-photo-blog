import { ReactNode } from 'react';
import clsx from 'clsx/lite';

export default function ScoreCardContainer({
  children,
}: {
  children: ReactNode
}) {
  return <div className={clsx(
    'max-w-xl w-full',
    'space-y-6 md:space-y-8',
  )}>
    {children}
  </div>;
}
