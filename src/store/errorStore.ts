import { create } from 'zustand';

type ErrorType = 'success' | 'error' | 'info';

interface ErrorState {
  visible: boolean;
  type: ErrorType;
  title: string;
  message: string;
  show: (type: ErrorType, title: string, message: string) => void;
  hide: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  visible: false,
  type: 'success',
  title: '',
  message: '',
  show: (type, title, message) => set({ visible: true, type, title, message }),
  hide: () => set({ visible: false }),
}));
