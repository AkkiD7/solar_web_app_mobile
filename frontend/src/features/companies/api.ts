import { api, authHeaders, envelope, asParams, cleanPayload } from '../shared/api/client';
import type { Paginated } from '../shared/types';
import type {
  Company, CompanyForm, CompanyQuery, CompanyStatus,
  CompanyDetail, CompanyAnalytics, CompanyUser, UserFormState,
  CreatedCompany, ImpersonationResult, Plan,
} from './types';

export const companiesApi = {
  list: (token: string, query: CompanyQuery) =>
    envelope<Paginated<Company>>(
      api.get('/companies', {
        headers: authHeaders(token),
        params: asParams({
          search: query.search, status: query.status, plan: query.plan,
          page: query.page, limit: query.limit, sortBy: query.sortBy, sortOrder: query.sortOrder,
        }),
      })
    ),

  create: (token: string, data: CompanyForm) =>
    envelope<CreatedCompany>(
      api.post('/companies', cleanPayload(data as unknown as Record<string, unknown>), { headers: authHeaders(token) })
    ),

  update: (token: string, id: string, data: Partial<CompanyForm>) =>
    envelope<Company>(
      api.put(`/companies/${id}`, cleanPayload(data as unknown as Record<string, unknown>), { headers: authHeaders(token) })
    ),

  delete: (token: string, id: string) =>
    envelope<Company>(api.delete(`/companies/${id}`, { headers: authHeaders(token) })),

  updateStatus: (token: string, id: string, status: CompanyStatus) =>
    envelope<Company>(api.patch(`/companies/${id}/status`, { status }, { headers: authHeaders(token) })),

  updatePlan: (token: string, id: string, plan: Plan) =>
    envelope<Company>(api.patch(`/companies/${id}/plan`, { plan }, { headers: authHeaders(token) })),

  bulkStatus: (token: string, companyIds: string[], status: CompanyStatus) =>
    envelope<{ modifiedCount: number }>(
      api.patch('/companies/bulk/status', { companyIds, status }, { headers: authHeaders(token) })
    ),

  bulkPlan: (token: string, companyIds: string[], plan: Plan) =>
    envelope<{ modifiedCount: number }>(
      api.patch('/companies/bulk/plan', { companyIds, plan }, { headers: authHeaders(token) })
    ),

  detail: (token: string, id: string) =>
    envelope<CompanyDetail>(api.get(`/companies/${id}`, { headers: authHeaders(token) })),

  analytics: (token: string, id: string) =>
    envelope<CompanyAnalytics>(api.get(`/companies/${id}/analytics`, { headers: authHeaders(token) })),

  impersonate: (token: string, id: string) =>
    envelope<ImpersonationResult>(api.post(`/companies/${id}/impersonate`, {}, { headers: authHeaders(token) })),

  // ── Users ──────────────────────────────────────────────
  listUsers: (token: string, companyId: string) =>
    envelope<CompanyUser[]>(api.get(`/companies/${companyId}/users`, { headers: authHeaders(token) })),

  createUser: (token: string, companyId: string, data: UserFormState) =>
    envelope<CompanyUser>(
      api.post(`/companies/${companyId}/users`,
        { name: data.name, email: data.email, password: data.password, role: data.role },
        { headers: authHeaders(token) }
      )
    ),

  updateUser: (token: string, companyId: string, userId: string, data: Partial<UserFormState>) =>
    envelope<CompanyUser>(
      api.put(`/companies/${companyId}/users/${userId}`,
        { name: data.name, email: data.email, role: data.role, isActive: data.isActive },
        { headers: authHeaders(token) }
      )
    ),

  deleteUser: (token: string, companyId: string, userId: string) =>
    envelope<CompanyUser>(api.delete(`/companies/${companyId}/users/${userId}`, { headers: authHeaders(token) })),

  resetUserPassword: (token: string, companyId: string, userId: string, newPassword: string) =>
    envelope<{ message: string }>(
      api.put(`/companies/${companyId}/users/${userId}/reset-password`, { newPassword }, { headers: authHeaders(token) })
    ),
};
