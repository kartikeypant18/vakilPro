'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type Tab = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
};

type TabsProps = {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn('inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
            value === tab.value 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50',
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'px-1.5 py-0.5 text-xs rounded-full min-w-[20px] text-center',
              value === tab.value ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-600'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
