import { useState } from 'react';
import clsx from 'clsx';
import { AlertCircle, Minus, Pencil, Plus, Trash } from 'lucide-react';

import { useTheme } from '@/hooks/useTheme';
import type { Category } from '@/types';

import { Button } from '../Button';

interface TableCategoriesProps {
  items: Category[];
  loading: boolean;
  error?: Error | null;
}

const formatCategoryDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  }).format(new Date(value));

const getLevelLabel = (depth: Category['depth']) =>
  depth === 1 ? 'Parent category' : 'Subcategory';

type CategoryRowProps = {
  category: Category;
  isChild?: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
  onToggle: (categoryId: string) => void;
};

function CategoryRow({
  category,
  isChild = false,
  hasChildren,
  isExpanded,
  onToggle,
}: CategoryRowProps) {
  return (
    <tr
      className={clsx(
        'h-[80px] text-[rgb(var(--color-text))]',
        isChild ? 'bg-[rgb(var(--color-bg-sec))]' : 'bg-[rgb(var(--color-bg))]',
      )}
    >
      <td className="w-[72px] text-center">
        {hasChildren ? (
          <button
            type="button"
            aria-label={
              isExpanded
                ? `Collapse ${category.title}`
                : `Expand ${category.title}`
            }
            className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-[rgb(var(--color-text))] bg-[rgb(var(--color-bg))] p-0 text-[rgb(var(--color-text))]"
            onClick={() => onToggle(category.id)}
          >
            {isExpanded ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="inline-block h-8 w-8" />
        )}
      </td>

      <td className="w-[96px] text-center">
        {category.imageUrl ? (
          <img
            alt={category.title}
            className="mx-auto h-10 w-10 rounded-md object-cover"
            src={category.imageUrl}
          />
        ) : (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-[#E5E7EB] text-xs text-[#8A92A6]">
            N/A
          </div>
        )}
      </td>

      <td className={clsx('font-medium', isChild && 'pl-6')}>
        {category.title}
      </td>
      <td className="max-w-[280px] truncate text-start">
        {category.description || '-'}
      </td>
      <td className="text-center">{getLevelLabel(category.depth)}</td>
      <td className="text-center">{formatCategoryDate(category.createdAt)}</td>
      <td className="text-center">{formatCategoryDate(category.updatedAt)}</td>
      <td className="text-center">
        <Button
          aria-label={`Delete ${category.title}`}
          className="bg-transparent text-[#DB162D] hover:bg-transparent"
          type="button"
        >
          <Trash className="h-[20px] w-[20px]" />
        </Button>
        <Button
          aria-label={`Edit ${category.title}`}
          className="bg-transparent text-gray-500 hover:bg-transparent hover:text-black"
          type="button"
        >
          <Pencil className="h-[20px] w-[20px]" />
        </Button>
      </td>
    </tr>
  );
}

function TableCategoriesContent({
  items,
  loading,
  error,
  isDark,
}: {
  items: Category[];
  loading: boolean;
  error: Error | null;
  isDark: boolean;
}) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  if (loading) {
    return (
      <tr>
        <td colSpan={8} className="py-8 text-center">
          Loading...
        </td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr role="alert">
        <td colSpan={8} className="py-8">
          <div
            className={clsx(
              'mx-auto flex max-w-md items-center gap-3 rounded-lg border p-4',
              {
                'border-red-900/50 bg-red-950/30 text-red-300': isDark,
                'border-red-200 bg-red-50 text-red-800': !isDark,
              },
            )}
          >
            <AlertCircle className="h-6 w-6 shrink-0" />
            <div className="text-left">
              <p className="font-medium">Failed to load categories</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  if (!items.length) {
    return (
      <tr>
        <td
          colSpan={8}
          className={clsx('py-8 text-center', {
            'text-black': isDark,
            'text-[#8A92A6]': !isDark,
          })}
        >
          No categories found
        </td>
      </tr>
    );
  }

  const childrenByParent = new Map<string, Category[]>();
  const categoryIds = new Set(items.map((item) => item.id));

  items.forEach((item) => {
    if (!item.parent) return;

    const siblings = childrenByParent.get(item.parent) ?? [];
    siblings.push(item);
    childrenByParent.set(item.parent, siblings);
  });

  const parentCategories = items.filter(
    (item) => item.depth === 1 || !item.parent || !categoryIds.has(item.parent),
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  return parentCategories.flatMap((parentCategory) => {
    const childCategories = childrenByParent.get(parentCategory.id) ?? [];
    const isExpanded = expandedIds.includes(parentCategory.id);

    const rows = [
      <CategoryRow
        key={parentCategory.id}
        category={parentCategory}
        hasChildren={childCategories.length > 0}
        isExpanded={isExpanded}
        onToggle={toggleCategory}
      />,
    ];

    if (isExpanded) {
      rows.push(
        ...childCategories.map((childCategory) => (
          <CategoryRow
            key={childCategory.id}
            category={childCategory}
            isChild
            hasChildren={false}
            isExpanded={false}
            onToggle={toggleCategory}
          />
        )),
      );
    }

    return rows;
  });
}

export function TableCategories({
  items,
  loading,
  error,
}: TableCategoriesProps) {
  const { isDark } = useTheme();

  return (
    <div className="mx-5 mt-5 rounded-l-lg rounded-r-lg border border-[#e5e7eb] shadow-md">
      <table className="[&_td]:px-4s w-full border-collapse overflow-hidden rounded-t-lg [&_td]:border-b [&_td]:border-[#e5e7eb] [&_thead_th]:border-b [&_thead_th]:border-[#e5e7eb] [&_thead_th]:px-4">
        <thead className="h-[50px] bg-[#F9FAFB] text-[#8A92A6]">
          <tr>
            <th className="w-[72px]"></th>
            <th className="w-[96px]">Image</th>
            <th className="text-left">Category name</th>
            <th>Description</th>
            <th>Level</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <TableCategoriesContent
            items={items}
            loading={loading}
            error={error ?? null}
            isDark={isDark}
          />
        </tbody>
      </table>
    </div>
  );
}
