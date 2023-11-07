import { useMediaQuery } from 'react-responsive';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@/../tailwind.config';

const screens = resolveConfig(tailwindConfig).theme?.screens as any;

export default function useIsDesktop() {
  const isDesktop = useMediaQuery({ query: `(min-width: ${screens.md})` });
  return isDesktop;
};
