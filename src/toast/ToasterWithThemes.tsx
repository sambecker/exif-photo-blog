'use client';

import { clsx } from 'clsx/lite';
import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

export default function ToasterWithThemes() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme as 'system' | 'light' | 'dark'}
      toastOptions={{
        classNames: {
          toast: clsx(
            'font-mono font-normal',
            '!text-gray-900 dark:!text-gray-100',
            '!bg-white dark:!bg-black',
            '!border-gray-200 dark:!border-gray-800',
          ),
        },
      }}
    />
  );
}
