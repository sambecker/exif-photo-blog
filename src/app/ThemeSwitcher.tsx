'use client';

import { useTheme } from 'next-themes';
import Switcher from '@/components/switcher/Switcher';
import SwitcherItem from '@/components/switcher/SwitcherItem';
import { BiDesktop, BiMoon, BiSun } from 'react-icons/bi';
import { useAppText } from '@/i18n/state/client';
import useIsHydrated from '@/utility/useIsHydrated';

export default function ThemeSwitcher () {
  // `theme` is only known on the client, so hold off on marking
  // an item active until the server and client agree
  const isHydrated = useIsHydrated();

  const appText = useAppText();

  const { theme, setTheme } = useTheme();

  return (
    <Switcher
      // Apply offset due to outline strategy
      className="translate-x-[-1px]"
    >
      <SwitcherItem
        icon={<BiDesktop size={16} />}
        onClick={() => setTheme('system')}
        active={isHydrated && theme === 'system'}
        tooltip={{ content: appText.theme.system }}
      />
      <SwitcherItem
        icon={<BiSun size={18} />}
        onClick={() => setTheme('light')}
        active={isHydrated && theme === 'light'}
        tooltip={{ content: appText.theme.light }}
      />
      <SwitcherItem
        icon={<BiMoon size={16} />}
        onClick={() => setTheme('dark')}
        active={isHydrated && theme === 'dark'}
        tooltip={{ content: appText.theme.dark }}
      />
    </Switcher>
  );
}
