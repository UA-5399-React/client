import { createContext } from 'react';

export interface OpenConfirmModalOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isCritical?: boolean;
}

export interface ConfirmModalContextValue {
  openConfirmModal: (options: OpenConfirmModalOptions) => void;
}

export const ConfirmModalContext =
  createContext<ConfirmModalContextValue | null>(null);
