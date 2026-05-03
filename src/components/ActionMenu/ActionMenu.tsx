import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { EllipsisVertical } from 'lucide-react';

import { Button } from '@/components/Button';

import styles from './ActionMenu.module.css';

export type ActionMenuItem = {
  id: string;
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
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = useCallback(() => {
    const trigger = rootRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    setMenuPosition({
      top: rect.top,
      left: rect.right - 50,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const close = (e: PointerEvent) => {
      const el = rootRef.current;
      const menuEl = menuRef.current;
      const target = e.target as Node;

      if (el?.contains(target) || menuEl?.contains(target)) return;

      if (el) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    updateMenuPosition();

    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [isOpen, updateMenuPosition]);

  if (!actions.length) return null;

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        aria-label={triggerAriaLabel ?? 'Open actions menu'}
        className={clsx(
          styles.button,
          'bg-transparent text-gray-600 hover:border-transparent!',
        )}
        onClick={() =>
          setIsOpen((prev) => {
            if (!prev) updateMenuPosition();
            return !prev;
          })
        }
      >
        <EllipsisVertical className="text-bgSecInverted h-5 w-5" />
      </Button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={clsx(
              'bg-background fixed z-20 mt-0 flex w-[160px] -translate-x-full flex-col rounded-xl border border-gray-300 p-2 shadow-lg',
              className,
            )}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >
            {actions.map((action, index) => (
              <div key={action.id}>
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
          </div>,
          document.body,
        )}
    </div>
  );
};
