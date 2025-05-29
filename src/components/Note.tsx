import { ComponentProps, ReactNode } from 'react';
import Container from './Container';
import AnimateItems from './AnimateItems';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { clsx } from 'clsx/lite';

export default function Note({
  icon,
  animate,
  cta,
  hideIcon,
  color = 'blue',
  padding,
  children,
  ...props
}: {
  icon?: ReactNode
  animate?: boolean
  cta?: ReactNode
  hideIcon?: boolean
} & ComponentProps<typeof Container>) {
  return (
    <AnimateItems
      type={animate ? 'bottom' : 'none'}
      items={[
        <Container
          {...props}
          key="Banner"
          color={color}
          padding={padding ?? (cta ? 'tight-cta-right' : 'tight')}
        >
          <div className={clsx(
            'flex items-center w-full gap-2.5',
          )}>
            {!hideIcon &&
              <span className={clsx(
                'w-5 flex justify-center shrink-0',
                'opacity-90',
              )}>
                {icon ?? <IoInformationCircleOutline
                  size={19}
                  className="translate-x-[0.5px] translate-y-[0.5px]"
                />}
              </span>}
            <span className="text-sm grow">
              {children}
            </span>
            {cta &&
              <span>
                {cta}
              </span>}
          </div>
        </Container>,
      ]}
      animateOnFirstLoadOnly
    />
  );
}
