'use client';

import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useNotificationStore } from '@/store/notification-store';
import { cn } from '@/lib/utils';

const variantStyles = {
  success: 'border-emerald-200 bg-emerald-50',
  error: 'border-red-200 bg-red-50',
  info: 'border-blue-200 bg-blue-50',
  warning: 'border-amber-200 bg-amber-50',
};

const variantIconStyles = {
  success: 'text-emerald-500 bg-emerald-100',
  error: 'text-red-500 bg-red-100',
  info: 'text-blue-500 bg-blue-100',
  warning: 'text-amber-500 bg-amber-100',
};

const variantIcon = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

export function Toaster() {
  const { toasts, dismissToast } = useNotificationStore();

  return (
    <aside className="fixed bottom-6 right-6 z-[999] flex w-96 flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const variant = toast.variant ?? 'info';
        const Icon = variantIcon[variant] || variantIcon.info;
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm animate-fade-in',
              variantStyles[variant] || variantStyles.info,
            )}
          >
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', variantIconStyles[variant] || variantIconStyles.info)}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="font-semibold text-slate-900 text-sm">{toast.title}</p>
              {toast.description && <p className="text-sm text-slate-600 mt-0.5">{toast.description}</p>}
            </div>
            <button
              type="button"
              className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </aside>
  );
}
