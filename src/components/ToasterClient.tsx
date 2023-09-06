'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

export default function ToasterClient() {
  const { theme } = useTheme();
  return (
    <Toaster theme={theme as 'system' | 'light' | 'dark'} />
  );
}