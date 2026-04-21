import { cn } from './cn';

interface SolarBackdropProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function SolarBackdrop({ size = 300, className, style }: SolarBackdropProps) {
  return (
    <div
      className={cn('absolute pointer-events-none opacity-40', className)}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--color-primary-soft) 0%, transparent 70%)',
        ...style,
      }}
    />
  );
}
