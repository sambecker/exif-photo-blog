import IconSort from '@/components/icons/IconSort';
import SwitcherItemMenu from '@/components/switcher/SwitcherItemMenu';

export default function SortMenu({
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
}) {
  return (
    <SwitcherItemMenu
      {...{ isOpen, setIsOpen }}
      icon={<IconSort
        className="shrink-0 translate-x-[0.5px] translate-y-[1px]"
      />}
      sections={[]}
      ariaLabel="Sort Menu"
    />
  );
}