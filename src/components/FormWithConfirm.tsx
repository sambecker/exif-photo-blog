'use client';

import { ReactNode } from 'react';

export default function FormWithConfirm({
  action,
  confirmText,
  onSubmit,
  children,
}: {
  action: (formData: FormData) => void
  confirmText?: string
  onSubmit?: () => void
  children: ReactNode
}) {
  return (
    <form
      action={action}
      onSubmit={e => {
        if (!confirmText || confirm(confirmText)) {
          e.currentTarget.requestSubmit();
          onSubmit?.();
        } else {
          e.preventDefault();
        }
      }}
    >
      {children}
    </form>
  );
};
