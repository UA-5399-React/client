import { BanIcon, CheckCheck } from 'lucide-react';

export const typeStyles = {
  success: {
    border: 'border-green-600',
    bg: 'bg-green-600',
    icon: CheckCheck,
  },
  error: {
    border: 'border-red-600',
    bg: 'bg-red-600',
    icon: BanIcon,
  },
  info: {
    border: 'border-blue-600',
    bg: 'bg-blue-600',
    icon: CheckCheck, // or Info icon if you add one
  },
};
