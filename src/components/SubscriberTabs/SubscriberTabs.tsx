import clsx from 'clsx';

type FilterType = 'all' | 'active' | 'inactive';

const SUBSCRIBER_TAB_OPTIONS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

interface SubscriberTabsProps {
  current: FilterType;
  onChange: (value: FilterType) => void;
}

export function SubscriberTabs({ current, onChange }: SubscriberTabsProps) {
  return (
    <div className="no-scrollbar mb-8 flex items-center gap-4 overflow-x-auto pb-2">
      {SUBSCRIBER_TAB_OPTIONS.map((tab) => {
        const isActive = current === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={clsx(
              'cursor-pointer border-none px-6 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-in-out focus:outline-none',
              isActive
                ? 'bg-((--color-bg-sec)) rounded-xl text-(--color-text) shadow-md'
                : 'rounded-xl bg-transparent text-[#5E6366] hover:bg-gray-50/50 hover:text-[#2C2C2C]',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
