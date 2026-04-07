import { useEffect } from 'react';
import { BanIcon, CheckCheck, X } from 'lucide-react';

import { useErrorStore } from '@/store/errorStore';

export function Message() {
  const { visible, type, title, message, hide } = useErrorStore();

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(hide, 4000);
    return () => clearTimeout(timer);
  }, [visible, hide]);

  if (!visible) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex max-w-[420px] min-w-[320px] items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3.5 shadow-sm ${isSuccess ? 'border-green-600' : 'border-red-600'} `}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isSuccess ? 'bg-green-600' : 'bg-red-600'} `}
      >
        {isSuccess ? (
          <CheckCheck size={20} className="text-white" />
        ) : (
          <BanIcon size={20} className="text-white" />
        )}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{message}</p>
      </div>

      <button
        onClick={hide}
        className="flex h-8 w-8 items-center justify-center rounded-md border-none bg-white text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
      >
        <X size={18} strokeWidth={2} />
      </button>
    </div>
  );
}
