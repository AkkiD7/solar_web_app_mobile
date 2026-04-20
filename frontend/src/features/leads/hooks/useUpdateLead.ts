import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { leadsApi } from '../api/leads.api';
import type { UpdateLeadRequest } from '../types';

export const useUpdateLead = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateLeadRequest) => leadsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Lead updated!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update lead');
    },
  });
};
