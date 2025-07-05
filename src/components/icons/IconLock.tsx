import { IconBaseProps } from 'react-icons';
import { BiLockAlt, BiLockOpenAlt } from 'react-icons/bi';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { FiLock } from 'react-icons/fi';

export default function IconLock({
  solid,
  narrow,
  open,
  ...props
}: IconBaseProps & { solid?: boolean, narrow?: boolean, open?: boolean }) {
  if (solid) {
    return open ? <FaLockOpen {...props} /> : <FaLock {...props} />;
  } else if (narrow) {
    return open ? <BiLockOpenAlt {...props} /> : <BiLockAlt {...props} />;
  } else {
    return open ? <FiLock {...props} /> : <FiLock {...props} />;
  }
}
