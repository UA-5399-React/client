import { useState } from 'react';
import { Calendar, Check, ChevronDown, RotateCcw } from 'lucide-react';

import { Button } from '@/components/Button';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import { useAdminProducts } from '@/hooks/useAdminProduct';
import type { Category } from '@/types';

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  categoryId: string;
  productId: string;
  productName: string;
}

export interface SalesDynamicsFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filter: FilterState) => void;
  initial: FilterState;
  isCompareMode?: boolean;
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

const today = toISODate(new Date());

const emptyFilter = (): FilterState => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return {
    dateFrom: toISODate(from),
    dateTo: toISODate(to),
    categoryId: '',
    productId: '',
    productName: '',
  };
};

export function SalesDynamicsFilter({
  isOpen,
  onClose,
  onApply,
  initial,
}: SalesDynamicsFilterProps) {
  const [draft, setDraft] = useState<FilterState>(initial);

  const { categories, loading: catLoading } = useAdminCategories();

  const { items: products, loading: prodLoading } = useAdminProducts({
    limit: 100,
    filters: draft.categoryId ? { categories: [draft.categoryId] } : {},
  });

  const handleCategoryChange = (categoryId: string) => {
    setDraft((prev) => ({
      ...prev,
      categoryId,
      productId: '',
      productName: '',
    }));
  };

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setDraft((prev) => ({
      ...prev,
      productId,
      productName: product?.title ?? '',
    }));
  };

  const handleReset = () => setDraft(emptyFilter());

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />

      <div className="absolute top-8 right-0 z-40 w-[320px] rounded-2xl border border-slate-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col gap-5 p-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-blue-500">
                Date range
              </span>
              <button
                onClick={() =>
                  setDraft((p) => ({
                    ...p,
                    dateFrom: emptyFilter().dateFrom,
                    dateTo: emptyFilter().dateTo,
                  }))
                }
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-slate-400 transition-colors outline-none hover:bg-slate-100 hover:text-blue-500 focus:outline-none"
                title="Reset date"
              >
                <RotateCcw size={14} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex h-9 flex-1 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 transition-colors focus-within:border-blue-500">
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
                  className="w-full cursor-pointer border-none bg-transparent text-[13px] text-slate-600 outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
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
                  className="w-full cursor-pointer border-none bg-transparent text-[13px] text-slate-600 outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-blue-500">
                Category
              </span>
              <button
                onClick={() => handleCategoryChange('')}
                className="flex h-6 w-6 items-center justify-center rounded-md border-none bg-transparent text-slate-400 transition-colors outline-none hover:bg-slate-100 hover:text-blue-500 focus:outline-none"
                title="Reset category"
              >
                <RotateCcw size={14} strokeWidth={1.5} />
              </button>
            </div>
            <div className="relative">
              <select
                value={draft.categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={catLoading}
                className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-[13px] text-slate-700 transition-colors outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="">Category</option>
                {categories.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-blue-500">
                Product
              </span>
              <button
                onClick={() =>
                  setDraft((p) => ({ ...p, productId: '', productName: '' }))
                }
                className="flex h-6 w-6 items-center justify-center rounded-md border-none bg-transparent text-slate-400 transition-colors outline-none hover:bg-slate-100 hover:text-blue-500 focus:outline-none"
                title="Reset product"
              >
                <RotateCcw size={14} strokeWidth={1.5} />
              </button>
            </div>
            <div className="relative">
              <select
                value={draft.productId}
                onChange={(e) => handleProductChange(e.target.value)}
                disabled={!draft.categoryId || prodLoading}
                className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-[13px] text-slate-700 transition-colors outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {!draft.categoryId ? 'Select category first' : 'Product'}
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400"
              />
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
            Reset all
          </Button>

          <Button
            variant="primary"
            onClick={handleApply}
            disabled={!draft.productId}
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
