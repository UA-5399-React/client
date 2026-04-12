import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useErrorStore } from '@/store/errorStore';

type LocationMessageState = {
  successMessage?: string;
  errorMessage?: string;
};

export const useErrorMessage = () => {
  const { state, pathname, search } = useLocation();
  const navigate = useNavigate();
  const showMessage = useErrorStore((s) => s.show);

  useEffect(() => {
    const typedState = state as LocationMessageState | null | undefined;
    if (!typedState) return;

    if (typedState.successMessage) {
      showMessage('success', 'Success!', typedState.successMessage);
    }
    if (typedState.errorMessage) {
      showMessage('error', 'Error', typedState.errorMessage);
    }
    if (typedState.successMessage || typedState.errorMessage) {
      navigate({ pathname, search }, { replace: true, state: null });
    }
  }, [state, pathname, search, navigate, showMessage]);
};
