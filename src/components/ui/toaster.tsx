'use client';

import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useNotificationStore } from '@/store/notification-store';
import { cn } from '@/lib/utils';


const variantStyles = {
  success: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-emerald-100',
  error: 'border-red-200 bg-gradient-to-br from-red-50 to-red-100 shadow-red-100',
  info: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-blue-100',
  warning: 'border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 shadow-amber-100',
};

const variantIconStyles = {
  success: 'text-emerald-600 bg-emerald-100',
  error: 'text-red-600 bg-red-100',
  info: 'text-blue-600 bg-blue-100',
  warning: 'text-amber-600 bg-amber-100',
};

const variantProgressBarStyles = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
};

const variantIcon = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};


import { useEffect, useState } from 'react';

interface ToastItemProps {
  id: string;
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onDismiss: (id: string) => void;
}

function ToastItem({ id, title, description, variant = 'info', duration = 5000, onDismiss }: ToastItemProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!duration || duration === 0) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 50));
        if (newProgress <= 0) {
          clearInterval(interval);
          onDismiss(id);
          return 0;
        }
        return newProgress;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [duration, id, onDismiss]);

  const Icon = variantIcon[variant] || variantIcon.info;

  return (
    <div
      className={cn(
        'pointer-events-auto flex flex-col gap-2 rounded-lg border p-4 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-300',
        variantStyles[variant] || variantStyles.info,
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 flex-none',
            variantIconStyles[variant] || variantIconStyles.info,
          )}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm leading-tight">{title}</p>
          {description && (
            <p className="text-xs text-slate-600 mt-1 leading-snug opacity-90">{description}</p>
          )}
        </div>
        <button
          type="button"
          className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-all duration-200 active:scale-95"
          onClick={() => onDismiss(id)}
          aria-label="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>
      {duration && duration > 0 && (
        <div className="h-1 bg-slate-200/40 rounded-full overflow-hidden -mx-4 px-4">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-100 ease-linear',
              variantProgressBarStyles[variant] || variantProgressBarStyles.info,
            )}
            style={{ width: `${Math.max(0, progress)}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}
    </div>
  );
}

export function Toaster() {
  const { toasts, dismissToast } = useNotificationStore();

  return (
    <aside
      className="fixed bottom-6 right-6 z-[999] flex w-full max-w-sm flex-col gap-2 pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          duration={toast.duration}
          onDismiss={dismissToast}
        />
      ))}
    </aside>
  );
}
