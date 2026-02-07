import { IconBaseProps } from 'react-icons';
import { HiLightningBolt } from 'react-icons/hi';
import { TbBolt } from 'react-icons/tb';

export default function IconRecents({
  solid,
  ...props
}: IconBaseProps & { solid?: boolean}) {
  return solid
    ? <HiLightningBolt {...props} />
    : <TbBolt {...props} />;
}
