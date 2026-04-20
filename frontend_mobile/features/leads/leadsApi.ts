import api from '../../shared/api/api';
import type { Lead, CreateLeadDto, UpdateLeadDto } from './types';

export const leadsApi = {
  getAll: async (): Promise<Lead[]> => {
    const res = await api.get('/leads');
    return res.data.data;
  },

  getById: async (id: string): Promise<Lead> => {
    const res = await api.get(`/leads/${id}`);
    return res.data.data;
  },

  create: async (data: CreateLeadDto): Promise<Lead> => {
    const res = await api.post('/leads', data);
    return res.data.data;
  },

  update: async (id: string, data: UpdateLeadDto): Promise<Lead> => {
    const res = await api.put(`/leads/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },
};
