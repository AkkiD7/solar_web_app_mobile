export interface RecentLead {
  _id: string;
  name: string;
  phone: string;
  status: string;
  createdAt: string;
}

export interface GlobalStats {
  totalCompanies: number;
  activeCompanies: number;
  suspendedCompanies: number;
  totalLeads: number;
  totalQuotes: number;
  totalUsers: number;
  totalRevenue: number;
  planBreakdown: Record<string, number>;
  recentLeads: RecentLead[];
}
