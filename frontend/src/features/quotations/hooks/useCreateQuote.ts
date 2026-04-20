import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { quotesApi } from '../api/quotes.api';
import type { CreateQuoteRequest } from '../types';

export const useCreateQuote = (leadId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuoteRequest) => quotesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes', leadId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Quote created successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create quote');
    },
  });
};
