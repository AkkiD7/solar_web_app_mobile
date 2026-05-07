import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ImpersonationResult } from '../types';

export function ImpersonationDialog({ result, onOpenChange }: { result: ImpersonationResult | null; onOpenChange: (open: boolean) => void }) {
  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.token);
    toast.success('Token copied');
  };

  return (
    <Dialog open={!!result} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Impersonation Token</DialogTitle>
          <DialogDescription>Use this token for the selected company admin session.</DialogDescription>
        </DialogHeader>
        {result ? (
          <div className="space-y-4">
            <div className="rounded-md border bg-muted p-3 text-sm">
              <div className="font-medium">{result.companyName}</div>
              <div className="text-muted-foreground">{result.userName}</div>
            </div>
            <textarea readOnly value={result.token} className="h-36 w-full resize-none rounded-md border bg-background p-3 font-mono text-xs" />
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={copy}><Copy className="size-4" /> Copy Token</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
