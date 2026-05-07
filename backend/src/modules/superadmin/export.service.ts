import { Company } from '../companies/company.model';
import { User } from '../users/user.model';
import { Lead } from '../leads/lead.model';
import { Quote } from '../quotations/quote.model';
import { AuditLog } from '../audit/audit-log.model';

// ── Helpers ──────────────────────────────────────────────────────────────────

function escapeCsv(val: unknown): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvRows(headers: string[], rows: Record<string, unknown>[]): string {
  const headerLine = headers.join(',');
  const dataLines = rows.map((row) =>
    headers.map((h) => escapeCsv(row[h])).join(',')
  );
  return [headerLine, ...dataLines].join('\n');
}

// ── Exports ──────────────────────────────────────────────────────────────────

export const exportCompaniesCSV = async (): Promise<string> => {
  const companies = await Company.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();

  const enriched = await Promise.all(
    companies.map(async (c) => {
      const [userCount, leadCount, quoteCount] = await Promise.all([
        User.countDocuments({ companyId: c._id }),
        Lead.countDocuments({ companyId: c._id, deletedAt: null }),
        Quote.countDocuments({ companyId: c._id, deletedAt: null }),
      ]);
      return {
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        plan: c.plan,
        status: c.status,
        gstNumber: c.gstNumber ?? '',
        website: c.website ?? '',
        userCount,
        leadCount,
        quoteCount,
        createdAt: c.createdAt.toISOString(),
      };
    })
  );

  return toCsvRows(
    ['name', 'email', 'phone', 'address', 'plan', 'status', 'gstNumber', 'website', 'userCount', 'leadCount', 'quoteCount', 'createdAt'],
    enriched
  );
};

export const exportAuditLogsCSV = async (
  filters: { limit?: number; action?: string; companyId?: string } = {}
): Promise<string> => {
  const { limit = 1000, action, companyId } = filters;
  const query: Record<string, unknown> = {};
  if (action) query.action = action;
  if (companyId) query.companyId = companyId;

  const logs = await AuditLog.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const rows = logs.map((l) => ({
    date: l.createdAt.toISOString(),
    action: l.action,
    companyId: l.companyId.toString(),
    performedBy: l.performedBy,
    entityId: l.entityId ?? '',
    metadata: l.metadata ? JSON.stringify(l.metadata) : '',
  }));

  return toCsvRows(['date', 'action', 'companyId', 'performedBy', 'entityId', 'metadata'], rows);
};

export const exportCompanyDataCSV = async (companyId: string): Promise<string> => {
  const [leads, quotes] = await Promise.all([
    Lead.find({ companyId, deletedAt: null }).lean(),
    Quote.find({ companyId, deletedAt: null }).lean(),
  ]);

  const leadRows = leads.map((l) => ({
    type: 'LEAD',
    name: l.name,
    phone: l.phone,
    email: l.email ?? '',
    location: l.location ?? '',
    status: l.status,
    systemSizeKW: l.systemSizeKW ?? '',
    amount: '',
    createdAt: l.createdAt.toISOString(),
  }));

  const quoteRows = quotes.map((q) => ({
    type: 'QUOTE',
    name: `Quote #${q.quoteNumber}`,
    phone: '',
    email: '',
    location: '',
    status: '',
    systemSizeKW: q.systemSizeKW,
    amount: q.totalCost,
    createdAt: q.createdAt.toISOString(),
  }));

  return toCsvRows(
    ['type', 'name', 'phone', 'email', 'location', 'status', 'systemSizeKW', 'amount', 'createdAt'],
    [...leadRows, ...quoteRows]
  );
};
