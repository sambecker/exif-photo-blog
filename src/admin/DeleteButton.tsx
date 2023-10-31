import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { FaTimes } from 'react-icons/fa';

export default function DeleteButton () {
  return <SubmitButtonWithStatus
    title="Delete"
    icon={<FaTimes size={13} className="translate-y-[1px]" />}
  >
    Delete
  </SubmitButtonWithStatus>;
}
