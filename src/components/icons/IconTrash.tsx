import { BiTrash } from 'react-icons/bi';
import { IconBaseProps } from 'react-icons/lib';

export default function IconTrash(props: IconBaseProps) {
  return <BiTrash
    {...props}
    size={props.size ?? 15}
  />;
}
