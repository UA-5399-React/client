import { useEffect, useRef, useState } from 'react';
import { EllipsisVertical, Pencil, Trash } from 'lucide-react';

import { Button } from '@/components/Button';

import styles from './ActionMenu.module.css';

interface ActionMenuProps {
  editAction: () => void;
  deleteAction?: () => void;
  className?: string;
}

export const ActionMenu = ({
  editAction,
  deleteAction,
  className,
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

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        className={`${styles.button} hover:text-bgSecInverted bg-transparent text-gray-600 hover:!border-transparent`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <EllipsisVertical className="text-bgSecInverted h-5 w-5" />
      </Button>

      {isOpen && (
        <div
          className={`bg-background absolute top-0 left-10 z-20 flex w-[140px] flex-col rounded-xl border border-gray-300 p-2 shadow-lg ${className ?? ''}`}
        >
          <Button
            type="button"
            className={`${styles.button} border-fieldBorder text-text border-b-2 bg-transparent`}
            onClick={() => {
              setIsOpen(false);
              editAction();
            }}
          >
            <div className={styles.buttonActionContent}>
              <Pencil />
              <span>Edit</span>
            </div>
          </Button>

          {deleteAction && (
            <hr className="my-2 w-full border-0 border-t border-gray-300" />
          )}

          {deleteAction && (
            <Button
              type="button"
              className={`${styles.button} bg-transparent text-red-700`}
              onClick={() => {
                setIsOpen(false);
                deleteAction();
              }}
            >
              <div className={styles.buttonActionContent}>
                <Trash />
                <span>Delete</span>
              </div>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
