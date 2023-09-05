'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Switcher from '@/components/Switcher';
import SwitcherItem from '@/components/SwitcherItem';
import { BiDesktop, BiMoon, BiSun } from 'react-icons/bi';

export default function ThemeSwitcher () {
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
      />
      <SwitcherItem
        icon={<BiSun size={18} />}
        onClick={() => setTheme('light')}
        active={theme === 'light'}
      />
      <SwitcherItem
        icon={<BiMoon size={16} />}
        onClick={() => setTheme('dark')}
        active={theme === 'dark'}
      />
    </Switcher>
  );
}
