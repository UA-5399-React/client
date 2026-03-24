import { useEffect, useRef, useState } from 'react';
import { EllipsisVertical, Pencil, Trash } from 'lucide-react';

import { Button } from '@/components/Button';

import styles from './ActionMenu.module.css';

interface ActionMenuProps {
  editAction: () => void;
  deleteAction?: () => void;
}

export const ActionMenu = ({ editAction, deleteAction }: ActionMenuProps) => {
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
        className={`${styles.button} text-gray600 hover:text-bgSecInverted bg-transparent hover:border-transparent!`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <EllipsisVertical className="text-bgSecInverted h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="align-center bg-background border-gray300 absolute top-0 left-10 z-20 flex w-[140px] flex-col rounded-xl border p-2 shadow-lg">
          <Button
            type="button"
            className={`${styles.button} text-text border-b-red700 border-b-2 bg-transparent`}
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
            <hr className="border-t-gray300 my-2 w-full border-0 border-t border-solid" />
          )}

          {deleteAction && (
            <Button
              type="button"
              className={`${styles.button} text-red700 bg-transparent`}
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
