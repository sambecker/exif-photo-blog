import { IconBaseProps } from 'react-icons';
import { LuFolderClosed } from 'react-icons/lu';

export default function IconAlbum(props: IconBaseProps) {
  return <LuFolderClosed {...{
    ...props,
    size: props.size ?? 14,
  }} />;
}
