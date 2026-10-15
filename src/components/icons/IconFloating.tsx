import { IconBaseProps } from 'react-icons';
import { TbFloatNone } from 'react-icons/tb';

export default function IconFloating({
  size = 18,
  ...props
}: IconBaseProps) {
  return <TbFloatNone {...{ size, ...props }} />;
}
