import { BASE_URL } from '../../shared/api/api';
import api from '../../shared/api/api';
import type { CreateQuoteDto, Quote } from './types';

export const quotesApi = {
  getAll: async (): Promise<Quote[]> => {
    const res = await api.get('/quotes');
    return res.data.data;
  },

  getByLeadId: async (leadId: string): Promise<Quote[]> => {
    const res = await api.get(`/quotes/lead/${leadId}`);
    return res.data.data;
  },

  getById: async (id: string): Promise<Quote> => {
    const res = await api.get(`/quotes/${id}`);
    return res.data.data;
  },

  create: async (data: CreateQuoteDto): Promise<Quote> => {
    const res = await api.post('/quotes', data);
    return res.data.data;
  },

  getPdfUrl: (id: string, token: string) => {
    return `${BASE_URL}/quotes/${id}/pdf?token=${encodeURIComponent(token)}`;
  },
};
