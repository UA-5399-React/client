import { createContext } from 'react';

export interface OpenModal {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isCritical?: boolean;
}

export interface ConfirmModalContextValue {
  openConfirmModal: (options: OpenModal) => void;
}

export const ConfirmModalContext =
  createContext<ConfirmModalContextValue | null>(null);
