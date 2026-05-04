import { useState } from 'react';
import { Calendar, Check, RotateCcw } from 'lucide-react';

import { Button } from '@/components/Button';

import { emptyGroupFilter } from './utils';

export interface GroupTableFilterState {
  dateFrom: string;
  dateTo: string;
}

export interface GroupTableFilterState {
  dateFrom: string;
  dateTo: string;
}

interface GroupTableFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filter: GroupTableFilterState) => void;
  initial: GroupTableFilterState;
}

export function GroupTableFilter({
  isOpen,
  onClose,
  onApply,
  initial,
}: GroupTableFilterProps) {
  const [draft, setDraft] = useState<GroupTableFilterState>(initial);

  const handleReset = () => setDraft(emptyGroupFilter());

  const today = new Date().toISOString().split('T')[0];

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />

      <div className="absolute top-8 left-0 z-40 w-[320px] rounded-2xl border border-slate-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col gap-5 p-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-blue-500">
                Date range
              </span>
              <button
                onClick={handleReset}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-slate-400 transition-colors outline-none hover:bg-slate-100 hover:text-blue-500"
                title="Reset date"
              >
                <RotateCcw size={14} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex h-9 min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 transition-colors focus-within:border-blue-500">
                <Calendar
                  size={14}
                  strokeWidth={1.5}
                  className="shrink-0 text-slate-400"
                />
                <input
                  type="date"
                  value={draft.dateFrom}
                  max={draft.dateTo}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, dateFrom: e.target.value }))
                  }
                  className="w-full cursor-pointer border-none bg-transparent text-[13px] text-slate-600 outline-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
              </div>

              <span className="text-slate-300">—</span>

              <div className="relative flex h-9 flex-1 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 transition-colors focus-within:border-blue-500">
                <Calendar
                  size={14}
                  strokeWidth={1.5}
                  className="shrink-0 text-slate-400"
                />
                <input
                  type="date"
                  value={draft.dateTo}
                  min={draft.dateFrom}
                  max={today}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, dateTo: e.target.value }))
                  }
                  className="w-full min-w-0 cursor-pointer border-none bg-transparent text-[13px] text-slate-600 outline-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 px-5 py-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex flex-1 items-center justify-center gap-2"
          >
            <RotateCcw size={14} strokeWidth={1.5} />
            Reset
          </Button>

          <Button
            variant="primary"
            onClick={handleApply}
            className="flex flex-1 items-center justify-center gap-2"
          >
            <Check size={14} strokeWidth={1.5} />
            Apply
          </Button>
        </div>
      </div>
    </>
  );
}
