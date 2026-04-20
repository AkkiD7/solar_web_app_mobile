// All queries scoped to companyId with explicit cross-tenant ownership checks
import mongoose from 'mongoose';
import { Quote } from './quote.model';
import { Lead } from '../leads/lead.model';
import { Company } from '../companies/company.model';
import { QuoteSettings } from '../companies/quoteSettings.model';
import { calculateQuote } from '../../utils/calculate';
import { auditLog } from '../audit/audit.service';
import { assertQuoteLimit } from '../../utils/planGate';
import { CompanyPlan } from '../companies/company.model';
import { generateQuoteHtml } from './quote.template';

const toObjId = (id: string) => new mongoose.Types.ObjectId(id);

async function getCompanyPlan(companyId: string): Promise<CompanyPlan> {
  const company = await Company.findById(companyId).select('plan').lean();
  return (company?.plan ?? 'FREE') as CompanyPlan;
}

// Auto-increment quoteNumber per company
async function nextQuoteNumber(companyId: string): Promise<number> {
  const last = await Quote.findOne({ companyId: toObjId(companyId) })
    .sort({ quoteNumber: -1 })
    .select('quoteNumber')
    .lean();
  return (last?.quoteNumber ?? 0) + 1;
}

export const createQuote = async (
  companyId: string,
  userId: string,
  data: Record<string, unknown>
) => {
  // ⚠️ CRITICAL: validate lead belongs to THIS company (cross-tenant check)
  const lead = await Lead.findOne({
    _id: data.leadId as string,
    companyId: toObjId(companyId),
    deletedAt: null,
  });
  if (!lead) throw new Error('Lead not found or access denied');

  const plan = await getCompanyPlan(companyId);
  await assertQuoteLimit(companyId, plan);

  const { panelCost, total } = calculateQuote({
    systemSizeKW: data.systemSizeKW as number,
    panelCostPerKW: data.panelCostPerKW as number,
    inverterCost: data.inverterCost as number,
    installationCost: data.installationCost as number,
  });

  const [quoteNumber] = await Promise.all([nextQuoteNumber(companyId)]);

  // validTill = 30 days from now
  const validTill = new Date();
  validTill.setDate(validTill.getDate() + 30);

  const quote = await Quote.create({
    ...data,
    companyId: toObjId(companyId),
    quoteNumber,
    panelCost,
    totalCost: total,
    validTill,
    createdBy: toObjId(userId),
    updatedBy: toObjId(userId),
  });

  auditLog({
    companyId,
    action: 'QUOTE_GENERATED',
    entityId: quote._id.toString(),
    performedBy: userId,
    metadata: { quoteNumber, totalCost: total },
  });

  return quote.toObject();
};

export const getQuotes = async (companyId: string) => {
  return Quote.find({ companyId: toObjId(companyId), deletedAt: null })
    .populate({
      path: 'leadId',
      match: { deletedAt: null },
      select: 'name phone email location systemSizeKW notes status createdAt updatedAt',
    })
    .sort({ createdAt: -1 })
    .lean();
};

export const getQuotesByLead = async (companyId: string, leadId: string) => {
  // Verify lead belongs to company first
  const lead = await Lead.findOne({
    _id: leadId,
    companyId: toObjId(companyId),
    deletedAt: null,
  });
  if (!lead) throw new Error('Lead not found');

  return Quote.find({ leadId, companyId: toObjId(companyId), deletedAt: null })
    .sort({ createdAt: -1 })
    .lean();
};

export const getQuoteById = async (companyId: string, quoteId: string) => {
  const quote = await Quote.findOne({
    _id: quoteId,
    companyId: toObjId(companyId),
    deletedAt: null,
  })
    .populate({ path: 'leadId', match: { deletedAt: null } })
    .lean();

  if (!quote || !quote.leadId) throw new Error('Quote not found');
  return quote;
};

export const generatePdf = async (companyId: string, quoteId: string): Promise<string> => {
  const quote = await getQuoteById(companyId, quoteId);
  const lead = quote.leadId as unknown as Record<string, unknown>;

  const [company, quoteSettings] = await Promise.all([
    Company.findById(companyId).lean(),
    QuoteSettings.findOne({ companyId }).lean(),
  ]);

  if (!company) throw new Error('Company not found');

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const html = generateQuoteHtml({
    quoteId: quote._id.toString(),
    quoteNumber: quote.quoteNumber,
    generatedDate: fmt(new Date((quote as any).createdAt as Date)),
    validTill: fmt(new Date(quote.validTill)),

    // Company branding
    companyName: company.name,
    companyPhone: company.phone,
    companyAddress: company.address,
    companyGstNumber: company.gstNumber,
    companyLogoUrl: quoteSettings?.logoUrl ?? company.logoUrl,
    headerText: quoteSettings?.headerText,
    footerText: quoteSettings?.footerText,
    signatureUrl: quoteSettings?.signatureUrl,

    // Customer info from lead
    customerName: lead.name as string,
    customerPhone: lead.phone as string,
    customerLocation: lead.location as string | undefined,

    // Pricing
    systemSizeKW: quote.systemSizeKW,
    panelCostPerKW: quote.panelCostPerKW,
    panelCost: quote.panelCost,
    inverterCost: quote.inverterCost,
    installationCost: quote.installationCost,
    totalCost: quote.totalCost,
  });

  return html;
};
