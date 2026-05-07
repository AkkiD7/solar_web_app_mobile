import { Clipboard, type LucideIcon } from 'lucide-react';

export function EmptyState({ title, icon: Icon = Clipboard }: { title: string; icon?: LucideIcon }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-card p-8 text-center">
      <div className="rounded-md bg-muted p-3 text-muted-foreground">
        <Icon className="size-5" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
    </div>
  );
}
