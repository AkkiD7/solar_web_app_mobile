import api from '../../shared/api/api';

export interface DashboardStats {
  totalLeads: number;
  wonDeals: number;
  totalRevenue: number;
  statusBreakdown: Record<string, number>;
  recentLeads: Array<{
    _id: string;
    name: string;
    status: string;
    createdAt: string;
  }>;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/dashboard/stats');
    return res.data.data;
  },
};
