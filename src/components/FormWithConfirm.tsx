'use client';

import { ReactNode } from 'react';

export default function FormWithConfirm({
  action,
  confirmText,
  onSubmit,
  children,
}: {
  action: (data: FormData) => Promise<void>
  confirmText: string
  onSubmit?: () => void
  children: ReactNode
}) {
  return (
    <form
      action={action}
      onSubmit={e => {
        if (!confirm(confirmText)) {
          e.preventDefault();
        } else {
          e.currentTarget.requestSubmit();
          onSubmit?.();
        }
      }}
    >
      {children}
    </form>
  );
};
