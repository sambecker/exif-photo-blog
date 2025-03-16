import { IconBaseProps } from 'react-icons';
import { TbCone } from 'react-icons/tb';

export default function IconFocalLength({
  style,
  ...props
}: IconBaseProps) {
  return <TbCone {...{
    ...props,
    style: {
      ...style,
      transform: `rotate(270deg)${style?.transform
        ? ` ${style.transform}`
        : ''}`,
    },
  }} />;
}
