type SortRadioItemProps = {
  checked: boolean;
  label: string;
  onClick: () => void;
};

export function SortRadioItem({ checked, label, onClick }: SortRadioItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-none bg-transparent text-left"
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
          checked ? 'border-blue-500' : 'border-gray-400'
        }`}
      >
        {checked && <span className="h-4 w-4 rounded-full bg-blue-500" />}
      </span>

      <span className="text-[16px] text-neutral-800">{label}</span>
    </button>
  );
}
