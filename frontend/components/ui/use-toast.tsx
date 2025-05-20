'use client';

import { useContext, createContext } from 'react';

type Toast = {
  title?: string;
  description?: string;
};

type ToastContextType = {
  toast: (toast: Toast) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export const ToastProvider = ToastContext.Provider;
