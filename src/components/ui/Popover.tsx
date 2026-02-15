import * as React from "react";

export function Popover({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function PopoverTrigger({ asChild, children, ...props }: any) {
  if (asChild) {
    return children;
  }
  return <button {...props}>{children}</button>;
}

export function PopoverContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className} style={{ border: "1px solid #ccc", padding: 8, borderRadius: 4 }}>{children}</div>;
}
