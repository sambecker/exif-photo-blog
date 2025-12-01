'use client';

import { usePathname } from 'next/navigation';
import NavClient from './NavClient';
import { ComponentProps } from 'react';

export function Nav(props: ComponentProps<typeof NavClient>) {
  const pathname = usePathname();
  return (
    <NavClient
      pathname={pathname}
      {...props}
    />
  );
}
