// Revenue = sum of totalCost from quotes where lead.status = WON
// All queries scoped to companyId — multi-tenant enforcement
import mongoose from 'mongoose';
import { Lead } from '../leads/lead.model';
import { Quote } from '../quotations/quote.model';
import { LeadStatus } from '../leads/leads.types';

export const getDashboardStats = async (companyId: string) => {
  const companyObjId = new mongoose.Types.ObjectId(companyId);

  const [totalLeads, wonLeads, recentLeads] = await Promise.all([
    Lead.countDocuments({ companyId: companyObjId, deletedAt: null }),
    Lead.find({ companyId: companyObjId, status: LeadStatus.WON, deletedAt: null })
      .select('_id')
      .lean(),
    Lead.find({ companyId: companyObjId, deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const wonLeadIds = wonLeads.map((l) => l._id);

  const revenueData = await Quote.aggregate([
    {
      $match: {
        companyId: companyObjId,
        leadId: { $in: wonLeadIds },
        deletedAt: null,
      },
    },
    { $group: { _id: null, totalRevenue: { $sum: '$totalCost' } } },
  ]);

  // Lead status distribution
  const statusBreakdown = await Lead.aggregate([
    { $match: { companyId: companyObjId, deletedAt: null } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  return {
    totalLeads,
    wonDeals: wonLeads.length,
    totalRevenue: revenueData[0]?.totalRevenue ?? 0,
    recentLeads,
    statusBreakdown: statusBreakdown.reduce(
      (acc, { _id, count }) => ({ ...acc, [_id]: count }),
      {} as Record<string, number>
    ),
  };
};
