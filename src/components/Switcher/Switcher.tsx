interface SwitcherProps {
  isRightActive: boolean;
  leftLabel: string;
  rightLabel: string;
  onToggle: () => void;
  ariaLabel?: string;
}

export function Switcher({
  isRightActive,
  leftLabel,
  rightLabel,
  onToggle,
  ariaLabel = 'Toggle values',
}: SwitcherProps) {
  return (
    <div className="text-text inline-flex items-center gap-2 text-sm">
      <span
        className={!isRightActive ? 'text-text font-semibold' : 'text-text'}
      >
        {leftLabel}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={isRightActive}
        onClick={onToggle}
        aria-label={ariaLabel}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:outline-none ${isRightActive ? 'bg-blue-500' : 'bg-gray-300'}`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${isRightActive ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>

      <span className={isRightActive ? 'text-text font-semibold' : 'text-text'}>
        {rightLabel}
      </span>
    </div>
  );
}
