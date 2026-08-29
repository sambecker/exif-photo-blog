import { IconBaseProps } from 'react-icons';
import { TbEdit } from 'react-icons/tb';

export default function IconEdit(props: IconBaseProps) {
  return <TbEdit {...{
    ...props,
    size: props.size || 16,
  }} />;
}
