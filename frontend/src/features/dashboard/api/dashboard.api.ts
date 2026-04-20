import api from '../../../shared/utils/api';

export interface DashboardStats {
  totalLeads: number;
  wonDeals: number;
  totalRevenue: number;
  recentLeads: any[];
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/dashboard/stats');
    return res.data.data;
  },
};
