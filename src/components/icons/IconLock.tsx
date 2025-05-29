import { IconBaseProps } from 'react-icons';
import { BiLockAlt } from 'react-icons/bi';
import { FiLock } from 'react-icons/fi';

export default function IconLock({
  narrow,
  ...props
}: IconBaseProps & { narrow?: boolean }) {
  return narrow
    ? <BiLockAlt {...props} />
    : <FiLock {...props} />;
}
