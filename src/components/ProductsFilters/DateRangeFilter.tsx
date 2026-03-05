interface DateRangeFilterProps {
  dateFrom: string;
  dateTo: string;
  dateField: 'createdAt' | 'updatedAt';
  onChange: (
    dateFrom: string,
    dateTo: string,
    dateField: 'createdAt' | 'updatedAt',
  ) => void;
}

export function DateRangeFilter({
  dateFrom,
  dateTo,
  dateField,
  onChange,
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-500">Date</span>

      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onChange(dateFrom, dateTo, 'createdAt')}
          className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors ${
            dateField === 'createdAt'
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-200 text-gray-500 hover:border-gray-400'
          }`}
        >
          Created
        </button>
        <button
          type="button"
          onClick={() => onChange(dateFrom, dateTo, 'updatedAt')}
          className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors ${
            dateField === 'updatedAt'
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-200 text-gray-500 hover:border-gray-400'
          }`}
        >
          Updated
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">From</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onChange(e.target.value, dateTo, dateField)}
            className="cursor-pointer rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <span className="mt-5 text-gray-400">—</span>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">To</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onChange(dateFrom, e.target.value, dateField)}
            className="cursor-pointer rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
