import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { cc } from '@/utility/css';
import { BiTrash } from 'react-icons/bi';

export default function DeleteButton () {
  return <SubmitButtonWithStatus
    title="Delete"
    icon={<BiTrash size={16} className="translate-y-[-1.5px]" />}
    spinnerColor="text"
    className={cc(
      'text-red-500 dark:text-red-600',
      'active:!bg-red-100/50 active:dark:!bg-red-950/50',
      '!border-red-200 hover:!border-red-300',
      'dark:!border-red-900/75 dark:hover:!border-red-900',
    )}
  />;
}
