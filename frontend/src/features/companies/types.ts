export const PLANS = ['FREE', 'STARTER', 'PRO'] as const;
export const STATUSES = ['ACTIVE', 'SUSPENDED'] as const;
export const USER_ROLES = ['ADMIN', 'MANAGER', 'SALES_REP', 'VIEWER'] as const;

export type Plan = (typeof PLANS)[number];
export type CompanyStatus = (typeof STATUSES)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type SortBy = 'name' | 'createdAt' | 'plan' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface OnboardingSteps {
  profileComplete?: boolean;
  logoUploaded?: boolean;
  firstLeadCreated?: boolean;
  firstQuoteGenerated?: boolean;
  pricingConfigured?: boolean;
}

export interface Company {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  gstNumber?: string;
  website?: string;
  logoUrl?: string;
  plan: Plan;
  status: CompanyStatus;
  userCount?: number;
  leadCount?: number;
  quoteCount?: number;
  onboardingProgress?: number;
  onboardingSteps?: OnboardingSteps;
  createdAt: string;
  updatedAt?: string;
}

export interface CompanyForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  website: string;
  plan: Plan;
}

export interface CompanyQuery {
  search: string;
  status: '' | CompanyStatus;
  plan: '' | Plan;
  page: number;
  limit: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export interface CompanyUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
}

export interface UserFormState {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

export interface QuoteStats {
  totalQuotes: number;
  totalRevenue: number;
  avgDealSize: number;
}

export interface CompanyDetail extends Company {
  users: CompanyUser[];
  leadsByStatus: Record<string, number>;
  totalLeads: number;
  quoteStats: QuoteStats;
  recentLogs: AuditLogEntry[];
  settings?: Record<string, unknown>;
  pricingConfig?: Record<string, unknown>;
  quoteSettings?: Record<string, unknown>;
}

export interface AuditLogEntry {
  _id: string;
  companyId?: string;
  action: string;
  entityId?: string;
  performedBy: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CompanyAnalytics {
  leadsByStatus: Record<string, number>;
  leadsByMonth: Array<{ month: string; count: number }>;
  quotesByMonth: Array<{ month: string; count: number; revenue: number }>;
  totalLeads: number;
  totalQuotes: number;
  totalRevenue: number;
  avgDealSize: number;
  conversionRate: number;
}

export interface CreatedCompany {
  _id: string;
}

export interface ImpersonationResult {
  token: string;
  companyName: string;
  userName: string;
}

export function userId(user: CompanyUser) {
  return user._id ?? user.id ?? '';
}
