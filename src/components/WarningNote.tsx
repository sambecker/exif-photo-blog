import { ReactNode } from 'react';
import { PiWarningBold } from 'react-icons/pi';
import Note from './Note';

export default function WarningNote({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <Note
      color="yellow"
      padding="tight"
      className={className}
      icon={<PiWarningBold size={17} className="translate-x-[0.5px]" />}
    >
      {children}
    </Note>
  );
}
