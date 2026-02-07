'use client';

import { useTheme } from 'next-themes';
import Switcher from '@/components/switcher/Switcher';
import SwitcherItem from '@/components/switcher/SwitcherItem';
import { BiDesktop, BiMoon, BiSun } from 'react-icons/bi';
import { useAppText } from '@/i18n/state/client';
import { useAppState } from './AppState';

export default function ThemeSwitcher () {
  const { hasLoadedWithAnimations } = useAppState();

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
        active={hasLoadedWithAnimations && theme === 'system'}
        tooltip={{ content: appText.theme.system }}
      />
      <SwitcherItem
        icon={<BiSun size={18} />}
        onClick={() => setTheme('light')}
        active={hasLoadedWithAnimations && theme === 'light'}
        tooltip={{ content: appText.theme.light }}
      />
      <SwitcherItem
        icon={<BiMoon size={16} />}
        onClick={() => setTheme('dark')}
        active={hasLoadedWithAnimations && theme === 'dark'}
        tooltip={{ content: appText.theme.dark }}
      />
    </Switcher>
  );
}
