import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';

export default function DeleteButton () {
  return <SubmitButtonWithStatus
    title="Delete"
    icon={<span className="inline-flex text-[18px]">×</span>}
  >
    Delete
  </SubmitButtonWithStatus>;
}
