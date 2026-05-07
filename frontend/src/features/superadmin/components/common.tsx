import { Clipboard, Loader2, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import type { CompanyStatus, Plan } from '../types';
import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

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
    <Card>
      <CardContent className="p-5">
        <div className={cn('mb-4 flex size-10 items-center justify-center rounded-md', tone)}>
          <Icon className="size-5" />
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} required={required} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

export function SimpleSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  placeholder?: string;
}) {
  const emptyValue = '__empty__';
  const displayValue = value === '' ? emptyValue : value;
  return (
    <div className="grid gap-2">
      {label ? <Label>{label}</Label> : null}
      <Select value={displayValue} onValueChange={(next) => onChange((next === emptyValue ? '' : next) as T)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value || emptyValue} value={option.value === '' ? emptyValue : option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function LoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-16 w-full" />
      ))}
    </div>
  );
}

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

export function Pagination({
  page,
  totalPages,
  total,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPage: (page: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>{total} total</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </Button>
        <span className="min-w-24 text-center">
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: CompanyStatus | 'INACTIVE' | 'ACTIVE' }) {
  return (
    <Badge variant={status === 'ACTIVE' ? 'success' : 'destructive'}>
      {status}
    </Badge>
  );
}

export function PlanBadge({ plan }: { plan: Plan }) {
  const variant = plan === 'PRO' ? 'warning' : plan === 'STARTER' ? 'default' : 'secondary';
  return <Badge variant={variant}>{plan}</Badge>;
}

export function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <Button type="submit" disabled={loading}>
      {loading ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}
