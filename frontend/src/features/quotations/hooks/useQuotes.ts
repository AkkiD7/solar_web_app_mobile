import { useQuery } from '@tanstack/react-query';
import { quotesApi } from '../api/quotes.api';

export const useQuotes = (leadId: string) => {
  return useQuery({
    queryKey: ['quotes', leadId],
    queryFn: () => quotesApi.getByLead(leadId),
    enabled: !!leadId,
  });
};
