import clsx from 'clsx/lite';
import { IconBaseProps } from 'react-icons';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';

export default function IconHidden({
  visible,
  ...props
}: IconBaseProps & {
  visible?: boolean
}) {
  // Flip so slash goes left to right
  props.className = clsx('-scale-x-100', props.className);
  return visible
    ? <AiOutlineEye {...props} />
    : <AiOutlineEyeInvisible {...props} />;
}
