import { ComponentProps, ReactNode } from 'react';
import Container from './Container';
import AnimateItems from './AnimateItems';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { clsx } from 'clsx/lite';

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
          <div className="flex items-center gap-2.5 pb-[1px]">
            <span className={clsx(
              'w-5 flex justify-center shrink-0',
              'opacity-90',
            )}>
              {icon ?? <IoInformationCircleOutline
                size={19}
                className="translate-x-[0.5px] translate-y-[0.5px]"
              />}
            </span>
            <span className="text-sm">
              {children}
            </span>
          </div>
        </Container>,
      ]}
      animateOnFirstLoadOnly
    />
  );
}
