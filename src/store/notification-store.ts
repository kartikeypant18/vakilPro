import { create } from 'zustand';


export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // in milliseconds, 0 = infinite
};

interface NotificationState {
  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  toasts: [],
  pushToast: (toast) => {
    const id = crypto.randomUUID();
    const duration = toast.duration ?? 5000; // default 5 seconds
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id, duration }],
    }));
    // Auto-dismiss after duration if duration is set
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
