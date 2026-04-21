import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../shared/ui/button';
import { Skeleton } from '../../../shared/ui/skeleton';
import { formatCurrency, formatDate } from '../../../shared/utils/format';
import { quotesApi } from '../api/quotes.api';
import type { Quote } from '../types';

interface QuoteListProps {
  quotes: Quote[];
  isLoading: boolean;
  isError: boolean;
}

export default function QuoteList({ quotes, isLoading, isError }: QuoteListProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (quoteId: string) => {
    setDownloadingId(quoteId);
    try {
      await quotesApi.downloadPdf(quoteId);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to generate PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return <div className="space-y-2">{[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;
  }

  if (isError) {
    return <p className="text-sm text-red-500 text-center py-4">Failed to load quotes</p>;
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-3xl mb-2">📋</div>
        <p className="text-textSoft font-bold text-sm">No quotes yet — create one above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {quotes.map((quote, index) => (
        <div
          key={quote._id}
          className="flex items-center justify-between p-4 bg-surfaceMuted/30 rounded-[16px] border border-border hover:border-primary-soft hover:shadow-floating transition-all"
        >
          <div>
            <p className="font-bold text-text text-sm">
              Quote #{quotes.length - index} — {quote.systemSizeKW} kW
            </p>
            <p className="text-xs font-medium text-textMuted mt-0.5">{formatDate(quote.createdAt)}</p>
            <div className="flex gap-3 mt-1.5 text-xs font-medium text-textSoft">
              <span>Panels: {formatCurrency(quote.panelCost)}</span>
              <span>•</span>
              <span>Inverter: {formatCurrency(quote.inverterCost)}</span>
              <span>•</span>
              <span>Install: {formatCurrency(quote.installationCost)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold tracking-widest uppercase text-textSoft mb-0.5">Total</p>
              <p className="font-black text-text text-base leading-none">{formatCurrency(quote.totalCost)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(quote._id)}
              disabled={downloadingId === quote._id}
              className="border-primary-soft text-primary-strong hover:bg-primary-soft h-10 px-3"
            >
              {downloadingId === quote._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="ml-1.5 font-bold">PDF</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
