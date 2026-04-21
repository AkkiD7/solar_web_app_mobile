import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CalendarDays, MapPin, Phone, FileText } from 'lucide-react';
import { Button } from '../shared/ui/button';
import { Skeleton } from '../shared/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../shared/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared/ui/select';
import { StatusPill, type StatusTone } from '../shared/ui/StatusPill';
import QuoteList from '../features/quotations/components/QuoteList';
import QuoteForm from '../features/quotations/components/QuoteForm';
import { useLead } from '../features/leads/hooks/useLeads';
import { useUpdateLead } from '../features/leads/hooks/useUpdateLead';
import { useQuotes } from '../features/quotations/hooks/useQuotes';
import { useCreateQuote } from '../features/quotations/hooks/useCreateQuote';
import { LeadStatus, LEAD_STATUS_OPTIONS } from '../shared/constants/leadStatus';
import { formatDate } from '../shared/utils/format';
import type { CreateQuoteRequest } from '../features/quotations/types';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);

  const { data: lead, isLoading: leadLoading, isError: leadError } = useLead(id!);
  const { data: quotes = [], isLoading: quotesLoading, isError: quotesError } = useQuotes(id!);
  const { mutate: updateLead } = useUpdateLead(id!);
  const { mutate: createQuote, isPending: creatingQuote } = useCreateQuote(id!);

  const handleStatusChange = (status: string) => {
    updateLead({ status: status as LeadStatus });
  };

  const getStatusTone = (status: string): StatusTone => {
    switch (status) {
      case 'NEW': return 'info';
      case 'CONTACTED': return 'warning';
      case 'QUOTED': return 'primary' as StatusTone;
      case 'WON': return 'success';
      case 'LOST': return 'danger';
      default: return 'neutral';
    }
  };

  const handleCreateQuote = (data: CreateQuoteRequest) => {
    createQuote(data, { onSuccess: () => setQuoteDialogOpen(false) });
  };

  if (leadLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (leadError || !lead) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-slate-600 font-medium">Lead not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/leads')}>
          Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/leads')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-text tracking-tight">{lead.name}</h1>
          <p className="text-textMuted font-medium text-sm mt-1">Added {formatDate(lead.createdAt)}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Select value={lead.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <StatusPill label={lead.status} tone={getStatusTone(lead.status)} />
        </div>
      </div>

      {/* Lead Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Contact Info */}
        <div className="bg-surface rounded-[24px] border border-border shadow-floating p-6 space-y-4">
          <h2 className="font-black text-[20px] text-text">Contact Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Phone className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="font-medium text-slate-700">{lead.phone}</p>
              </div>
            </div>
            {lead.location && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="font-medium text-slate-700">{lead.location}</p>
                </div>
              </div>
            )}
            {lead.followUpDate && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <CalendarDays className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Follow-up Date</p>
                  <p className="font-medium text-slate-700">{formatDate(lead.followUpDate)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-surface rounded-[24px] border border-border shadow-floating p-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-textSoft" />
            <h2 className="font-black text-[20px] text-text">Notes</h2>
          </div>
          {lead.notes ? (
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{lead.notes}</p>
          ) : (
            <p className="text-sm text-slate-300 italic">No notes added yet</p>
          )}
        </div>
      </div>

      {/* Quotations Section */}
      <div className="bg-surface rounded-[24px] border border-border shadow-floating p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-black text-[20px] text-text">Quotations</h2>
            <p className="text-sm font-medium text-textMuted mt-1">{quotes.length} quote{quotes.length !== 1 ? 's' : ''} created</p>
          </div>
          <Button
            size="sm"
            id="add-quote-btn"
            onClick={() => setQuoteDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Quote
          </Button>
        </div>
        <QuoteList quotes={quotes} isLoading={quotesLoading} isError={quotesError} />
      </div>

      {/* Create Quote Dialog */}
      <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Quote for {lead.name}</DialogTitle>
          </DialogHeader>
          <QuoteForm
            leadId={id!}
            onSubmit={handleCreateQuote}
            isLoading={creatingQuote}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
