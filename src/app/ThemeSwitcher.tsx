'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Switcher from '@/components/Switcher';
import SwitcherItem from '@/components/SwitcherItem';
import { BiDesktop, BiMoon, BiSun } from 'react-icons/bi';
import { useAppText } from '@/i18n/state/client';

export default function ThemeSwitcher () {
  const appText = useAppText();

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Switcher>
      <SwitcherItem
        icon={<BiDesktop size={16} />}
        onClick={() => setTheme('system')}
        active={theme === 'system'}
        tooltip={{ content: appText.theme.system }}
      />
      <SwitcherItem
        icon={<BiSun size={18} />}
        onClick={() => setTheme('light')}
        active={theme === 'light'}
        tooltip={{ content: appText.theme.light }}
      />
      <SwitcherItem
        icon={<BiMoon size={16} />}
        onClick={() => setTheme('dark')}
        active={theme === 'dark'}
        tooltip={{ content: appText.theme.dark }}
      />
    </Switcher>
  );
}
