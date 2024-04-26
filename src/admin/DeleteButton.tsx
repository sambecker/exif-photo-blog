import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { clsx } from 'clsx/lite';
import { ComponentProps } from 'react';
import { BiTrash } from 'react-icons/bi';

export default function DeleteButton (
  props: ComponentProps<typeof SubmitButtonWithStatus>
) {
  return <SubmitButtonWithStatus
    {...props}
    title="Delete"
    icon={<BiTrash size={16} className="translate-y-[-1.5px]" />}
    spinnerColor="text"
    className={clsx(
      'text-red-500 dark:text-red-600',
      'active:!bg-red-100/50 active:dark:!bg-red-950/50',
      '!border-red-200 hover:!border-red-300',
      'dark:!border-red-900/75 dark:hover:!border-red-900',
    )}
  />;
}
