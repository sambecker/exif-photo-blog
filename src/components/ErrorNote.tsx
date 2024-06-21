import { ReactNode } from 'react';
import { BiErrorAlt } from 'react-icons/bi';
import Note from './Note';

export default function ErrorNote({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <Note
      color="red"
      padding="tight"
      className={className}
      icon={<BiErrorAlt size={18} className="translate-x-[0.5px]" />}
    >
      {children}
    </Note>
  );
}
