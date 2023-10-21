import { TbPhotoShare } from 'react-icons/tb';
import IconPathButton from '@/components/IconPathButton';

export default function ShareButton({
  path,
  prefetch,
  shouldScroll,
  dim,
}: {
  path: string
  prefetch?: boolean
  shouldScroll?: boolean
  dim?: boolean
}) {
  return (
    <IconPathButton {...{
      path,
      icon: <TbPhotoShare size={17} className={dim
        ? 'text-dim'
        : undefined} />,
      prefetch,
      shouldScroll,
      shouldReplace: true,
      spinnerColor: 'dim',
    }} />
  );
}
