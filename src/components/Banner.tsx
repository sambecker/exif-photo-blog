import { ReactNode } from 'react';
import InfoBlock from './InfoBlock';
import AnimateItems from './AnimateItems';

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
          <div className="flex items-center gap-3">
            {icon}
            {children}
          </div>
        </InfoBlock>,
      ]}
      animateOnFirstLoadOnly
    />
  );
}
