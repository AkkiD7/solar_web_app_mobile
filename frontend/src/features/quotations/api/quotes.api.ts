import api from '../../../shared/utils/api';
import type { Quote, CreateQuoteRequest } from '../types';

export const quotesApi = {
  getByLead: async (leadId: string): Promise<Quote[]> => {
    const res = await api.get(`/quotes/lead/${leadId}`);
    return res.data.data;
  },

  create: async (data: CreateQuoteRequest): Promise<Quote> => {
    const res = await api.post('/quotes', data);
    return res.data.data;
  },

  downloadPdf: async (quoteId: string): Promise<void> => {
    const res = await api.get(`/quotes/${quoteId}/pdf`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `quote-${quoteId}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  },
};
