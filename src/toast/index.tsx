import type { ReactNode } from 'react';
import { PiWarningBold } from 'react-icons/pi';
import { toast } from 'sonner';
import Spinner from '@/components/Spinner';
import { FaRegCircleCheck } from 'react-icons/fa6';

const DEFAULT_DURATION = 4000;

// Pass an existing toast id to update that toast in place
type ToastId = string | number;

export const toastSuccess = (
  message: ReactNode,
  duration = DEFAULT_DURATION,
  id?: ToastId,
) => toast(
  message, {
    icon: <FaRegCircleCheck
      size={15}
      className="text-medium"
    />,
    duration,
    id,
  },
);

export const toastWarning = (
  message: ReactNode,
  duration = DEFAULT_DURATION,
  id?: ToastId,
) => toast(
  message, {
    icon: <PiWarningBold
      size={16}
      className="text-medium"
    />,
    duration,
    id,
  },
);

export const toastWaiting = (
  message: ReactNode,
  duration = Infinity,
  id?: ToastId,
) => toast(
  message, {
    icon: <Spinner size={16} />,
    duration,
    id,
  },
);
