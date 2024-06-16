import { ReactNode } from 'react';
import InfoBlock from './InfoBlock';
import AnimateItems from './AnimateItems';
import { IoInformationCircleOutline } from 'react-icons/io5';

export default function Banner({
  icon,
  children,
  animate,
  className,
}: {
  icon?: ReactNode
  children: ReactNode
  animate?: boolean
  className?: string
}) {
  return (
    <AnimateItems
      type={animate ? 'bottom' : 'none'}
      items={[
        <InfoBlock
          key="Banner"
          className={className}
          centered={false}
          padding="tight"
          color="blue"
        >
          <div className="flex items-center gap-2.5">
            {icon ?? <IoInformationCircleOutline
              size={18}
              className="translate-y-[1px] shrink-0"
            />}
            {children}
          </div>
        </InfoBlock>,
      ]}
      animateOnFirstLoadOnly
    />
  );
}
