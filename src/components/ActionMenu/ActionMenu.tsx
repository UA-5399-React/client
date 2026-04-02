import { type ReactNode, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { EllipsisVertical } from 'lucide-react';

import { Button } from '@/components/Button';

import styles from './ActionMenu.module.css';

export type ActionMenuItem = {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  title?: string;
};

interface ActionMenuProps {
  actions: ActionMenuItem[];
  className?: string;
  triggerAriaLabel?: string;
}

export const ActionMenu = ({
  actions,
  className,
  triggerAriaLabel,
}: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const close = (e: PointerEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [isOpen]);

  if (!actions.length) return null;

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        aria-label={triggerAriaLabel ?? 'Open actions menu'}
        className={clsx(
          styles.button,
          'bg-transparent text-gray-600 hover:!border-transparent',
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <EllipsisVertical className="text-bgSecInverted h-5 w-5" />
      </Button>

      {isOpen && (
        <div
          className={clsx(
            'bg-background absolute top-full right-0 z-20 mt-2 flex w-[160px] flex-col rounded-xl border border-gray-300 p-2 shadow-lg',
            className,
          )}
        >
          {actions.map((action, index) => (
            <div key={`${action.label}-${index}`}>
              {index > 0 && (
                <hr className="my-2 w-full border-0 border-t border-gray-300" />
              )}

              <Button
                type="button"
                title={action.title}
                disabled={action.disabled}
                className={clsx(
                  styles.button,
                  'bg-transparent disabled:cursor-not-allowed disabled:opacity-50',
                  action.variant === 'danger' ? 'text-red-700' : 'text-text',
                )}
                onClick={() => {
                  setIsOpen(false);
                  action.onClick();
                }}
              >
                <div className={styles.buttonActionContent}>
                  {action.icon}
                  <span>{action.label}</span>
                </div>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
