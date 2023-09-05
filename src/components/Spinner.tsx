import { ClipLoader } from 'react-spinners';
import resolveConfig from 'tailwindcss/resolveConfig';
import myConfig from '../../tailwind.config.js';

const TAILWIND_COLORS = resolveConfig(myConfig).theme?.colors as any;

export default function Spinner({
  size = 35,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <ClipLoader {...{
      size,
      className,
      color: TAILWIND_COLORS.gray[300],
    }} />
  );
};
