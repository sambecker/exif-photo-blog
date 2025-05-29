import { IconBaseProps } from 'react-icons';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';

export default function IconHidden({
  visible,
  ...props
}: IconBaseProps & {
  visible?: boolean
}) {
  return visible
    ? <AiOutlineEye {...props} />
    : <AiOutlineEyeInvisible {...props} />;
}
