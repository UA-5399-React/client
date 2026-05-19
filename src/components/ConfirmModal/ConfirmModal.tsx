import { Button } from '@/components/Button';
import type { OpenModal } from '@/types/confirmModal';

import styles from './ConfirmModal.module.css';

export const ConfirmModal = ({
  title,
  description,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isCritical = false,
}: OpenModal) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[rgba(0,0,0,0.5)]"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex w-full max-w-[600px] flex-col items-center rounded-lg bg-[rgb(var(--color-bg-sec))] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
          {title}
        </h2>

        <p className={`mt-2 text-sm text-[rgb(var(--color-text))]`}>
          {description}
        </p>

        <div className="mt-4 flex w-full justify-center gap-4">
          <Button
            onClick={onConfirm}
            className={`w-full max-w-[208px] ${isCritical ? styles.confirmButtonCritical : styles.confirmButton}`}
          >
            {confirmText}
          </Button>

          <Button
            onClick={onCancel}
            className="w-full max-w-[208px] bg-[rgb(var(--color-blue-primary))] text-white hover:border-[rgb(var(--color-blue-primary))]! hover:bg-transparent hover:text-[rgb(var(--color-blue-primary))]"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};
