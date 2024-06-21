'use client';

import { ReactNode } from 'react';

export default function FormWithConfirm({
  action,
  confirmText,
  onSubmit,
  className,
  children,
}: {
  action: (formData: FormData) => void
  confirmText?: string
  onSubmit?: () => void
  className?: string
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
      className={className}
    >
      {children}
    </form>
  );
};
