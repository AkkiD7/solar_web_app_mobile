import type { LeadStatus } from '../../shared/constants/leadStatus';

export type { LeadStatus } from '../../shared/constants/leadStatus';

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  status: LeadStatus;
  systemSizeKW?: number;
  notes?: string;
  followUpDate?: string | null;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  name: string;
  phone: string;
  email?: string;
  location?: string;
  systemSizeKW?: number;
  notes?: string;
  followUpDate?: string | null;
  status?: LeadStatus;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {}
