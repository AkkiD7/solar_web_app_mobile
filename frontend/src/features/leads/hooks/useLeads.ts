import { useQuery } from '@tanstack/react-query';
import { leadsApi } from '../api/leads.api';

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getAll,
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getById(id),
    enabled: !!id,
  });
};
