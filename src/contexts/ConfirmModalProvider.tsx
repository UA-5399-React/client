import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

import { ConfirmModal } from '@/components';
import {
  ConfirmModalContext,
  type OpenConfirmModalOptions,
} from '@/types/confirmModal';

export const ConfirmModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modalState, setModalState] = useState<OpenConfirmModalOptions | null>(
    null,
  );
  const isOpen = modalState !== null;

  const openConfirmModal = useCallback((options: OpenConfirmModalOptions) => {
    setModalState(options);
  }, []);

  const closeModal = useCallback(() => {
    setModalState(null);
  }, []);

  const handleConfirm = useCallback(() => {
    modalState?.onConfirm();
    closeModal();
  }, [modalState, closeModal]);

  const handleCancel = useCallback(() => {
    modalState?.onCancel?.();
    closeModal();
  }, [modalState, closeModal]);

  return (
    <ConfirmModalContext.Provider value={{ openConfirmModal }}>
      {children}
      {isOpen &&
        createPortal(
          <ConfirmModal
            isCritical={modalState!.isCritical}
            title={modalState!.title}
            description={modalState!.description}
            confirmText={modalState!.confirmText}
            cancelText={modalState!.cancelText}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />,
          document.body,
        )}
    </ConfirmModalContext.Provider>
  );
};
