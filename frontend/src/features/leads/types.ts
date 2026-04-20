import { LeadStatus } from '../../shared/constants/leadStatus';

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  location?: string;
  status: LeadStatus;
  notes?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadRequest {
  name: string;
  phone: string;
  location?: string;
  status?: LeadStatus;
  notes?: string;
  followUpDate?: string;
}

export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {}
