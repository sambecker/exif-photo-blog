import { BiCopy } from 'react-icons/bi';
import LoaderButton from './primitives/LoaderButton';
import clsx from 'clsx/lite';
import { toastSuccess } from '@/toast';
import Tooltip from './Tooltip';
import { ComponentProps } from 'react';

export default function CopyButton({
  label,
  text,
  subtle,
  iconSize = 15,
  tooltip,
  tooltipColor,
  className,
}: {
  label: string
  text?: string,
  subtle?: boolean
  iconSize?: number
  tooltip?: string
  tooltipColor?: ComponentProps<typeof Tooltip>['color']
  className?: string
}) {
  const button = 
    <LoaderButton
      icon={<BiCopy size={iconSize} />}
      className={clsx(
        subtle && 'text-gray-300 dark:text-gray-700',
        className,
      )}
      onClick={text
        ? () => {
          navigator.clipboard.writeText(text);
          toastSuccess(`${label} copied to clipboard`);
        }
        : undefined}
      styleAs="link"
      disabled={!text}
    />;

  return (
    tooltip
      ? <Tooltip content={tooltip} color={tooltipColor}>
        {button}
      </Tooltip>
      : button
  );
}
