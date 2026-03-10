import type { ReactNode } from 'react';

type SortOrderButtonProps = {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
};

export function SortOrderButton({
  active,
  icon,
  label,
  onClick,
}: SortOrderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[16px] transition ${
        active
          ? 'border border-blue-500 bg-blue-50 text-blue-600'
          : 'border-none bg-transparent text-gray-800 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
