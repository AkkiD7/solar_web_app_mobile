import { Sun } from 'lucide-react';
import { cn } from './cn';

interface SolarBrandProps {
  size?: 'normal' | 'large' | 'hero';
  centered?: boolean;
  subtitle?: string;
  className?: string;
}

export function SolarBrand({ size = 'normal', centered = false, subtitle, className }: SolarBrandProps) {
  const isHero = size === 'hero';
  const isLarge = size === 'large' || isHero;

  return (
    <div className={cn('flex flex-col', centered && 'items-center', className)}>
      <div className={cn('flex items-center', centered && 'justify-center')}>
        <div
          className={cn(
            'flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary-soft to-white border border-border/60 shadow-sm',
            isLarge ? 'w-16 h-16 mr-4 rounded-3xl' : 'w-10 h-10 mr-3'
          )}
        >
          <Sun
            size={isLarge ? 32 : 20}
            strokeWidth={2.5}
            className="text-primary-strong animate-[spin_12s_linear_infinite]"
          />
        </div>
        <div className="flex flex-col">
          <h1
            className={cn(
              'font-black text-text tracking-tight leading-none',
              isHero ? 'text-4xl' : isLarge ? 'text-2xl' : 'text-lg'
            )}
          >
            Solar
            <span className="text-primary">Contractor</span>
          </h1>
          {isLarge && (
            <span className="text-xs font-bold tracking-widest text-textSoft uppercase mt-1.5">
              Operating System
            </span>
          )}
        </div>
      </div>
      {subtitle && (
        <p
          className={cn(
            'text-textMuted font-medium',
            centered && 'text-center',
            isHero ? 'mt-6 text-[15px] max-w-[280px] leading-relaxed' : 'mt-2 text-sm'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
