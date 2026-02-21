import { IconBaseProps } from 'react-icons/lib';
import { MdWarningAmber } from 'react-icons/md';

export default function IconWarning(props: IconBaseProps) {
  return <MdWarningAmber
    {...props}
    size={props.size ?? 17}
  />;
}
