import { useState } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

import { Checkbox, type NewsletterSubscriber } from '@/components';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';

import { ConfirmModal } from '..';
import { SubscriberTabs } from '../SubscriberTabs/SubscriberTabs';

type FilterType = 'all' | 'active' | 'inactive';

interface TableSubscribersProps {
  items: NewsletterSubscriber[];
  loading: boolean;
  error?: Error | null;
  onDelete: (email: string) => void;
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span
        className={clsx('h-2 w-2 rounded-full', {
          'bg-green-500': isActive,
          'bg-red-500': !isActive,
        })}
      />
      <span>{isActive ? 'Active' : 'Inactive'}</span>
    </div>
  );
}

function renderBodyContent(
  loading: boolean,
  error: Error | null,
  items: NewsletterSubscriber[],
  isDark: boolean,
  selectedEmails: Set<string>,
  onToggleOne: (email: string) => void,
) {
  if (loading) {
    return (
      <tr>
        <td colSpan={3}>Loading...</td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr role="alert">
        <td colSpan={3} className="py-8">
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
              <p className="font-medium">Failed to load subscribers</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  if (!items?.length) {
    return (
      <tr>
        <td
          colSpan={3}
          className={clsx('py-8 text-center', {
            'text-black': isDark,
            'text-[#8A92A6]': !isDark,
          })}
        >
          No subscribers found
        </td>
      </tr>
    );
  }

  return items.map((item: NewsletterSubscriber) => (
    <tr
      className="h-[80px] text-center text-[rgb(var(--color-text))]"
      key={item.email}
    >
      <td>
        <div className="flex items-center gap-4">
          <Checkbox
            className="h-[20px] w-[20px]"
            checked={selectedEmails.has(item.email)}
            onCheckedChange={() => onToggleOne(item.email)}
          />
          <span>{item.email}</span>
        </div>
      </td>
      <td>
        <StatusBadge isActive={item.isActive} />
      </td>
    </tr>
  ));
}

export function TableSubscribers({
  items,
  loading,
  error,
  onDelete,
}: TableSubscribersProps) {
  const { isDark } = useTheme();
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const filteredItems = items.filter((item) => {
    if (filter === 'active') return item.isActive;
    if (filter === 'inactive') return !item.isActive;
    return true;
  });

  const allSelected =
    filteredItems.length > 0 &&
    filteredItems.every((item) => selectedEmails.has(item.email));

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedEmails((prev) => {
        const next = new Set(prev);
        filteredItems.forEach((item) => next.delete(item.email));
        return next;
      });
    } else {
      setSelectedEmails((prev) => {
        const next = new Set(prev);
        filteredItems.forEach((item) => next.add(item.email));
        return next;
      });
    }
  };

  const handleToggleOne = (email: string) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) {
        next.delete(email);
      } else {
        next.add(email);
      }
      return next;
    });
  };

  const handleConfirmUnsubscribe = () => {
    selectedEmails.forEach((email) => onDelete(email));
    setSelectedEmails(new Set());
    setShowConfirmModal(false);
  };

  const selectedCount = selectedEmails.size;

  return (
    <div className="mt-5">
      <div className="mb-4 flex items-center justify-between">
        <SubscriberTabs current={filter} onChange={setFilter} />

        <Button
          onClick={() => setShowConfirmModal(true)}
          disabled={selectedCount == 0}
        >
          Unsubscribe selected ({selectedCount})
        </Button>
      </div>

      <div className="overflow-x-auto rounded-l-lg rounded-r-lg border border-[#e5e7eb] shadow-md">
        <table className="w-full border-collapse overflow-hidden rounded-t-lg [&_td]:border-b [&_td]:border-[#e5e7eb] [&_thead_th]:border-b [&_thead_th]:border-[#e5e7eb] [&_thead_th]:px-4">
          <thead className="h-[50px] bg-[#F9FAFB] px-[12px] text-[#8A92A6]">
            <tr>
              <th>
                <div className="flex items-center gap-4">
                  <Checkbox
                    className="h-[20px] w-[20px]"
                    checked={allSelected}
                    onCheckedChange={handleToggleAll}
                  />
                  <span>Email</span>
                </div>
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="bg-[rgb(var(--color-bg-sec))] [&_td]:px-4 [&_td]:text-center">
            {renderBodyContent(
              loading,
              error ?? null,
              filteredItems,
              isDark,
              selectedEmails,
              handleToggleOne,
            )}
          </tbody>
        </table>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          title="Unsubscribe users"
          description={`Are you sure you want to unsubscribe ${selectedCount} ${selectedCount === 1 ? 'user' : 'users'}? They will stop receiving newsletter emails.`}
          confirmText="Unsubscribe"
          cancelText="Cancel"
          isCritical
          onConfirm={handleConfirmUnsubscribe}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}
