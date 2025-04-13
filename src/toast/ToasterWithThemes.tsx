'use client';

import { clsx } from 'clsx/lite';
import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

export default function ToasterWithThemes() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      theme={resolvedTheme as 'light' | 'dark' | undefined}
      toastOptions={{
        classNames: {
          toast: clsx(
            'flex items-center gap-x-1.5 p-4 w-full',
            'font-mono text-sm',
            'bg-white dark:bg-black',
            'text-gray-900 dark:text-gray-100',
            'border-medium!',
          ),
        },
      }}
    />
  );
}
