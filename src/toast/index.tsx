import type { ReactNode } from 'react';
import { PiWarningBold } from 'react-icons/pi';
import { toast } from 'sonner';
import Spinner from '@/components/Spinner';
import { FaRegCircleCheck } from 'react-icons/fa6';

const DEFAULT_DURATION = 4000;

export const toastSuccess = (
  message: ReactNode,
  duration = DEFAULT_DURATION,
) => toast(
  message, {
    icon: <FaRegCircleCheck
      size={15}
      className="text-medium"
    />,
    duration,
  },
);

export const toastWarning = (
  message: ReactNode,
  duration = DEFAULT_DURATION,
) => toast(
  message, {
    icon: <PiWarningBold
      size={16}
      className="text-medium"
    />,
    duration,
  },
);

export const toastWaiting = (
  message: ReactNode,
  duration = Infinity,
) => toast(
  message, {
    icon: <Spinner size={16} />,
    duration,
  },
);
