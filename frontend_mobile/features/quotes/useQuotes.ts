import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { quotesApi } from './quotesApi';
import type { CreateQuoteDto } from './types';

export const quoteKeys = {
  all: ['quotes'] as const,
  lists: () => [...quoteKeys.all, 'list'] as const,
  listByLead: (leadId: string) => [...quoteKeys.all, 'lead', leadId] as const,
  detail: (id: string) => [...quoteKeys.all, 'detail', id] as const,
};

export function useAllQuotes() {
  return useQuery({
    queryKey: quoteKeys.lists(),
    queryFn: quotesApi.getAll,
  });
}

export function useQuotesByLead(leadId: string) {
  return useQuery({
    queryKey: quoteKeys.listByLead(leadId),
    queryFn: () => quotesApi.getByLeadId(leadId),
    enabled: !!leadId,
  });
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: quoteKeys.detail(id),
    queryFn: () => quotesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuoteDto) => quotesApi.create(data),
    onSuccess: (quote, variables) => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.all });
      queryClient.invalidateQueries({ queryKey: quoteKeys.listByLead(variables.leadId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.setQueryData(quoteKeys.detail(quote._id), quote);
    },
  });
}
