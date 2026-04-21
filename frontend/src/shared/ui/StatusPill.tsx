import { cn } from './cn';

export type StatusTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral';

interface StatusPillProps {
  label: string;
  tone?: StatusTone;
  compact?: boolean;
  className?: string;
}

const toneMap: Record<StatusTone, string> = {
  success: 'bg-success-soft text-success border-success/20',
  info: 'bg-info-soft text-info border-info/20',
  warning: 'bg-warning-soft text-warning border-warning/20',
  danger: 'bg-danger-soft text-danger border-danger/20',
  neutral: 'bg-surfaceMuted text-textMuted border-border',
};

export function StatusPill({ label, tone = 'neutral', compact = false, className }: StatusPillProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center font-bold uppercase tracking-wider border',
        compact ? 'px-2 py-0.5 text-[9px] rounded-md' : 'px-3 py-1.5 text-[10px] rounded-lg',
        toneMap[tone],
        className
      )}
    >
      {label}
    </div>
  );
}
