import { useEffect } from 'react';
import { Button } from '@base-ui/react/button';
import { X } from 'lucide-react';

import { useErrorStore } from '@/store/errorStore';

import { typeStyles } from './messageTypesStyle';

export function Message() {
  const { visible, type, title, message, hide } = useErrorStore();

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(hide, 4000);
    return () => clearTimeout(timer);
  }, [visible, hide]);

  if (!visible) return null;

  const current = typeStyles[type];
  const Icon = current.icon;

  return (
    <div
      className={`fixed top-6 right-6 z-100 flex max-w-[420px] min-w-[320px] items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3.5 shadow-sm ${current.border} `}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${current.bg} `}
      >
        <Icon size={20} className="text-white" />
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{message}</p>
      </div>

      <Button
        onClick={hide}
        className="flex h-8 w-8 items-center justify-center rounded-md border-none bg-white text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
      >
        <X size={18} strokeWidth={2} />
      </Button>
    </div>
  );
}
