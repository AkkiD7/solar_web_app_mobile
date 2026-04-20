import api from '../../../shared/utils/api';
import type { Lead, CreateLeadRequest, UpdateLeadRequest } from '../types';

export const leadsApi = {
  getAll: async (): Promise<Lead[]> => {
    const res = await api.get('/leads');
    return res.data.data;
  },

  getById: async (id: string): Promise<Lead> => {
    const res = await api.get(`/leads/${id}`);
    return res.data.data;
  },

  create: async (data: CreateLeadRequest): Promise<Lead> => {
    const res = await api.post('/leads', data);
    return res.data.data;
  },

  update: async (id: string, data: UpdateLeadRequest): Promise<Lead> => {
    const res = await api.put(`/leads/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },
};
