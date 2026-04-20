export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN';
  companyId: string;
  companyName: string;
  companyLogo: string | null;
  plan: 'FREE' | 'STARTER' | 'PRO';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
