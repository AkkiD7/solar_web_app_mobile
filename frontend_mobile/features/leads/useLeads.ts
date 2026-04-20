import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from './leadsApi';
import type { CreateLeadDto, UpdateLeadDto } from './types';

export const leadKeys = {
  all: ['leads'] as const,
  detail: (id: string) => [...leadKeys.all, id] as const,
};

export function useLeads() {
  return useQuery({
    queryKey: leadKeys.all,
    queryFn: leadsApi.getAll,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: leadKeys.detail(id),
    queryFn: () => leadsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadDto) => leadsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateLead(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLeadDto) => leadsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
}
