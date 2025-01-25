import { BiCopy } from 'react-icons/bi';
import LoaderButton from './primitives/LoaderButton';
import clsx from 'clsx/lite';
import { toastSuccess } from '@/toast';

export default function CopyButton({
  label,
  text,
  subtle,
}: {
  label: string
  text?: string,
  subtle?: boolean
}) {
  return (
    <LoaderButton
      icon={<BiCopy size={15} />}
      className={clsx(
        'translate-y-[2px]',
        subtle && 'text-gray-300 dark:text-gray-700',
      )}
      onClick={text
        ? () => {
          navigator.clipboard.writeText(text);
          toastSuccess(`${label} copied to clipboard`);
        }
        : undefined}
      styleAs="link"
      disabled={!text}
    />
  );
}
