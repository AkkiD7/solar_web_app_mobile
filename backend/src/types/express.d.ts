// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        companyId: string;
        role: 'ADMIN' | 'MANAGER' | 'SALES_REP' | 'VIEWER';
      };
      superAdmin?: {
        id: string;
        email: string;
        role: 'SUPER_ADMIN';
      };
    }
  }
}

export {};
