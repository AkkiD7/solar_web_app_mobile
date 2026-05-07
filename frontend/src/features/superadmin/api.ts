import axios from 'axios';
import type {
  ApiEnvelope,
  AuditLog,
  AuditQuery,
  Company,
  CompanyAnalytics,
  CompanyDetail,
  CompanyForm,
  CompanyQuery,
  CompanyStatus,
  CompanyUser,
  CreatedCompany,
  GlobalStats,
  ImpersonationResult,
  LoginResponse,
  Paginated,
  Plan,
  PlanConfig,
  PlatformAdmin,
  SystemHealth,
  UserFormState,
} from './types';

export const SUPERADMIN_TOKEN_KEY = 'sa_token';
export const SUPERADMIN_THEME_KEY = 'sa_theme';
const BASE = '/api/superadmin';

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function envelope<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  return promise.then((response) => response.data.data);
}

function asParams(values: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined && value !== '')
  );
}

function cleanCompanyPayload(data: Partial<CompanyForm>) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== '')
  );
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
}

export const superAdminApi = {
  login: (email: string, password: string) =>
    envelope<LoginResponse>(axios.post(`${BASE}/login`, { email, password })),

  changePassword: (token: string, currentPassword: string, newPassword: string) =>
    envelope<{ message: string }>(
      axios.put(`${BASE}/profile/password`, { currentPassword, newPassword }, { headers: authHeaders(token) })
    ),

  listAdmins: (token: string) =>
    envelope<PlatformAdmin[]>(axios.get(`${BASE}/admins`, { headers: authHeaders(token) })),

  createAdmin: (token: string, email: string, password: string) =>
    envelope<PlatformAdmin>(axios.post(`${BASE}/admins`, { email, password }, { headers: authHeaders(token) })),

  deleteAdmin: (token: string, id: string) =>
    envelope<{ message: string }>(axios.delete(`${BASE}/admins/${id}`, { headers: authHeaders(token) })),

  stats: (token: string) =>
    envelope<GlobalStats>(axios.get(`${BASE}/stats`, { headers: authHeaders(token) })),

  auditLogs: (token: string, query: AuditQuery) =>
    envelope<Paginated<AuditLog>>(
      axios.get(`${BASE}/audit-logs`, {
        headers: authHeaders(token),
        params: asParams({ action: query.action, page: query.page, limit: query.limit }),
      })
    ),

  activityLogs: (token: string, companyId?: string) =>
    envelope<Paginated<AuditLog>>(
      axios.get(`${BASE}/audit-logs`, {
        headers: authHeaders(token),
        params: asParams({ page: 1, limit: 30, companyId }),
      })
    ),

  health: (token: string) =>
    envelope<SystemHealth>(axios.get(`${BASE}/system/health`, { headers: authHeaders(token) })),

  planConfigs: (token: string) =>
    envelope<PlanConfig[]>(axios.get(`${BASE}/plan-config`, { headers: authHeaders(token) })),

  updatePlanConfig: (token: string, plan: Plan, data: Omit<PlanConfig, 'plan' | '_id'>) =>
    envelope<PlanConfig>(axios.put(`${BASE}/plan-config/${plan}`, data, { headers: authHeaders(token) })),

  companies: (token: string, query: CompanyQuery) =>
    envelope<Paginated<Company>>(
      axios.get(`${BASE}/companies`, {
        headers: authHeaders(token),
        params: asParams({
          search: query.search,
          status: query.status,
          plan: query.plan,
          page: query.page,
          limit: query.limit,
          sortBy: query.sortBy,
          sortOrder: query.sortOrder,
        }),
      })
    ),

  createCompany: (token: string, data: CompanyForm) =>
    envelope<CreatedCompany>(
      axios.post(`${BASE}/companies`, cleanCompanyPayload(data), { headers: authHeaders(token) })
    ),

  updateCompany: (token: string, id: string, data: Partial<CompanyForm>) =>
    envelope<Company>(
      axios.put(`${BASE}/companies/${id}`, cleanCompanyPayload(data), { headers: authHeaders(token) })
    ),

  deleteCompany: (token: string, id: string) =>
    envelope<Company>(axios.delete(`${BASE}/companies/${id}`, { headers: authHeaders(token) })),

  updateStatus: (token: string, id: string, status: CompanyStatus) =>
    envelope<Company>(
      axios.patch(`${BASE}/companies/${id}/status`, { status }, { headers: authHeaders(token) })
    ),

  updatePlan: (token: string, id: string, plan: Plan) =>
    envelope<Company>(
      axios.patch(`${BASE}/companies/${id}/plan`, { plan }, { headers: authHeaders(token) })
    ),

  bulkStatus: (token: string, companyIds: string[], status: CompanyStatus) =>
    envelope<{ modifiedCount: number }>(
      axios.patch(`${BASE}/companies/bulk/status`, { companyIds, status }, { headers: authHeaders(token) })
    ),

  bulkPlan: (token: string, companyIds: string[], plan: Plan) =>
    envelope<{ modifiedCount: number }>(
      axios.patch(`${BASE}/companies/bulk/plan`, { companyIds, plan }, { headers: authHeaders(token) })
    ),

  detail: (token: string, id: string) =>
    envelope<CompanyDetail>(axios.get(`${BASE}/companies/${id}`, { headers: authHeaders(token) })),

  analytics: (token: string, id: string) =>
    envelope<CompanyAnalytics>(axios.get(`${BASE}/companies/${id}/analytics`, { headers: authHeaders(token) })),

  listUsers: (token: string, companyId: string) =>
    envelope<CompanyUser[]>(axios.get(`${BASE}/companies/${companyId}/users`, { headers: authHeaders(token) })),

  createUser: (token: string, companyId: string, data: UserFormState) =>
    envelope<CompanyUser>(
      axios.post(
        `${BASE}/companies/${companyId}/users`,
        { name: data.name, email: data.email, password: data.password, role: data.role },
        { headers: authHeaders(token) }
      )
    ),

  updateUser: (token: string, companyId: string, userId: string, data: Partial<UserFormState>) =>
    envelope<CompanyUser>(
      axios.put(
        `${BASE}/companies/${companyId}/users/${userId}`,
        { name: data.name, email: data.email, role: data.role, isActive: data.isActive },
        { headers: authHeaders(token) }
      )
    ),

  deleteUser: (token: string, companyId: string, userId: string) =>
    envelope<CompanyUser>(
      axios.delete(`${BASE}/companies/${companyId}/users/${userId}`, { headers: authHeaders(token) })
    ),

  resetUserPassword: (token: string, companyId: string, userId: string, newPassword: string) =>
    envelope<{ message: string }>(
      axios.put(
        `${BASE}/companies/${companyId}/users/${userId}/reset-password`,
        { newPassword },
        { headers: authHeaders(token) }
      )
    ),

  impersonate: (token: string, id: string) =>
    envelope<ImpersonationResult>(
      axios.post(`${BASE}/companies/${id}/impersonate`, {}, { headers: authHeaders(token) })
    ),
};

export async function downloadSuperAdminCsv(
  token: string,
  path: string,
  filename: string,
  params?: Record<string, string | number | undefined>
) {
  const response = await axios.get<string>(`${BASE}${path}`, {
    headers: authHeaders(token),
    params: params ? asParams(params) : undefined,
    responseType: 'text',
  });
  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
