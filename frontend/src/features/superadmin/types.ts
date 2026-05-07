export const PLANS = ['FREE', 'STARTER', 'PRO'] as const;
export const STATUSES = ['ACTIVE', 'SUSPENDED'] as const;
export const USER_ROLES = ['ADMIN', 'MANAGER', 'SALES_REP', 'VIEWER'] as const;

export type Plan = (typeof PLANS)[number];
export type CompanyStatus = (typeof STATUSES)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type SortBy = 'name' | 'createdAt' | 'plan' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface ApiEnvelope<T> {
  success?: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorPayload {
  message?: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface OnboardingSteps {
  profileComplete?: boolean;
  logoUploaded?: boolean;
  firstLeadCreated?: boolean;
  firstQuoteGenerated?: boolean;
  pricingConfigured?: boolean;
}

export interface RecentLead {
  _id: string;
  name: string;
  phone: string;
  status: string;
  createdAt: string;
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

export interface AuditLog {
  _id: string;
  companyId?: string;
  action: string;
  entityId?: string;
  performedBy: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AuditQuery {
  action: string;
  page: number;
  limit: number;
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
  recentLogs: AuditLog[];
  settings?: Record<string, unknown>;
  pricingConfig?: Record<string, unknown>;
  quoteSettings?: Record<string, unknown>;
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

export interface PlanConfig {
  _id?: string;
  plan: Plan;
  maxLeads: number;
  maxQuotes: number;
  maxUsers: number;
  features: string[];
}

export interface PlatformAdmin {
  _id: string;
  email: string;
  createdAt?: string;
}

export interface SystemHealth {
  status: string;
  database: {
    status: string;
    collections: Record<string, number>;
  };
  server: {
    uptime: number;
    memoryUsage: {
      rss: number;
      heapUsed: number;
      heapTotal: number;
    };
    platform: string;
    nodeVersion: string;
    cpuCount: number;
    freeMemoryMB: number;
    totalMemoryMB: number;
  };
  timestamp: string;
}

export interface LoginResponse {
  token: string;
}

export interface CreatedCompany {
  _id: string;
}

export interface ImpersonationResult {
  token: string;
  companyName: string;
  userName: string;
}

export const auditActions = [
  'USER_LOGIN',
  'LEAD_CREATED',
  'LEAD_UPDATED',
  'LEAD_DELETED',
  'QUOTE_GENERATED',
  'SETTINGS_UPDATED',
  'LOGO_UPLOADED',
  'PLAN_CHANGED',
  'COMPANY_SUSPENDED',
  'COMPANY_ACTIVATED',
  'COMPANY_UPDATED',
  'COMPANY_DELETED',
  'USER_CREATED',
  'USER_UPDATED',
  'USER_DELETED',
  'PASSWORD_RESET',
  'IMPERSONATION',
];
