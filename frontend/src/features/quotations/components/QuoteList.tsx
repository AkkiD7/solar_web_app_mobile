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
        <p className="text-slate-500 text-sm">No quotes yet — create one above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {quotes.map((quote, index) => (
        <div
          key={quote._id}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-orange-200 hover:shadow-sm transition-all"
        >
          <div>
            <p className="font-semibold text-slate-800 text-sm">
              Quote #{quotes.length - index} — {quote.systemSizeKW} kW
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{formatDate(quote.createdAt)}</p>
            <div className="flex gap-3 mt-1 text-xs text-slate-500">
              <span>Panels: {formatCurrency(quote.panelCost)}</span>
              <span>•</span>
              <span>Inverter: {formatCurrency(quote.inverterCost)}</span>
              <span>•</span>
              <span>Install: {formatCurrency(quote.installationCost)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-400">Total</p>
              <p className="font-bold text-orange-600 text-base">{formatCurrency(quote.totalCost)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(quote._id)}
              disabled={downloadingId === quote._id}
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              {downloadingId === quote._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="ml-1.5">PDF</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
