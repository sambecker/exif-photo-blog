'use client';

import { ReactNode } from 'react';

export default function FormWithConfirm({
  action,
  confirmText,
  children,
}: {
  action: (data: FormData) => Promise<void>
  confirmText: string
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
        }
      }}
    >
      {children}
    </form>
  );
};
