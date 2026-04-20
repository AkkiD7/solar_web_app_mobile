import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './dashboardApi';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
    staleTime: 1000 * 60, // 1 min
  });
}
