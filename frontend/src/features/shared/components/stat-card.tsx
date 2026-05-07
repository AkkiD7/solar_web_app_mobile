import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'text-primary bg-primary/10',
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  tone?: string;
}) {
  return (
    <div className="bg-surface border border-outline-variant/60 p-card-padding rounded-xl relative overflow-hidden group hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">{label}</p>
        <div className={cn('w-10 h-10 flex items-center justify-center rounded-lg', tone)}>
          <Icon className="size-5" />
        </div>
      </div>
      <h2 className="font-stat-hero text-stat-hero text-white tracking-tight mb-2">{value}</h2>
      
      {/* Example trend block, ideally this would come from props if available from the backend */}
      <div className="flex items-center gap-1.5 text-emerald-400 opacity-80">
        <span className="material-symbols-outlined text-[14px]">trending_up</span>
        <span className="text-[11px] font-bold">+5.2% <span className="text-on-surface-variant/60 font-medium">vs last month</span></span>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
}
