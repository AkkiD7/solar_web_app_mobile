import type { ReactNode } from 'react';
import { Card, CardContent } from './card';
import { cn } from './cn';

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <Card className={cn('flex-1 border-0 shadow-floating p-5', className)}>
      <div className="w-10 h-10 rounded-[14px] bg-primary-soft items-center justify-center flex mb-4 text-primary-strong">
        {icon}
      </div>
      <p className="text-textMuted text-sm font-semibold mb-2">{label}</p>
      <h3 className="text-text text-[28px] font-black leading-none">{value}</h3>
    </Card>
  );
}
