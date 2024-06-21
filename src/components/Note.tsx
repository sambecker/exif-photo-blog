import { ComponentProps, ReactNode } from 'react';
import Container from './Container';
import AnimateItems from './AnimateItems';
import { IoInformationCircleOutline } from 'react-icons/io5';

export default function Note({
  children,
  className,
  color = 'blue',
  icon,
  animate,
}: {
  icon?: ReactNode
  animate?: boolean
} & ComponentProps<typeof Container>) {
  return (
    <AnimateItems
      type={animate ? 'bottom' : 'none'}
      items={[
        <Container
          key="Banner"
          className={className}
          centered={false}
          padding="tight"
          color={color}
        >
          <div className="flex items-center gap-2.5">
            <span className="shrink-0 opacity-90">
              {icon ?? <IoInformationCircleOutline
                size={18}
                className="translate-y-[1px]"
              />}
            </span>
            {children}
          </div>
        </Container>,
      ]}
      animateOnFirstLoadOnly
    />
  );
}
