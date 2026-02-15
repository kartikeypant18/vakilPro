import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  children: ReactNode;
}

export function Modal({ title, description, primaryAction, secondaryAction, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
        <header className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          {onClose && (
            <button 
              type="button" 
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </header>
        <div className="p-6 text-slate-700">{children}</div>
        {(primaryAction || secondaryAction) && (
          <footer className="flex flex-wrap justify-end gap-3 p-6 pt-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
            {secondaryAction && (
              <Button variant="ghost" type="button" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button type="button" onClick={primaryAction.onClick} disabled={primaryAction.loading}>
                {primaryAction.loading ? 'Loading...' : primaryAction.label}
              </Button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
