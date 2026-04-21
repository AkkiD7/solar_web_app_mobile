import api from '../../../shared/utils/api';
import type { LoginRequest, AuthResponse } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', data);
    return res.data.data;
  },
  register: async (data: any): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data);
    return res.data.data;
  },
};
