import { BiCopy } from 'react-icons/bi';
import LoaderButton from './primitives/LoaderButton';
import clsx from 'clsx/lite';
import { toastSuccess } from '@/toast';

export default function CopyButton({
  label,
  text,
  subtle,
  className,
}: {
  label: string
  text?: string,
  subtle?: boolean
  className?: string
}) {
  return (
    <LoaderButton
      icon={<BiCopy size={15} />}
      className={clsx(
        subtle && 'text-gray-300 dark:text-gray-700',
        className,
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
