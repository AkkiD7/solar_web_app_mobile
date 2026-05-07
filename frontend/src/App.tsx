import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SuperAdminAuthProvider } from '@/features/superadmin/auth';
import { SuperAdminLayout } from '@/features/superadmin/layout';
import { ActivityPage, AuditLogsPage } from '@/features/superadmin/pages/audit-logs-page';
import { AdminsPage } from '@/features/superadmin/pages/admins-page';
import { CompaniesPage } from '@/features/superadmin/pages/companies-page';
import { CompanyDetailPage } from '@/features/superadmin/pages/company-detail-page';
import { DashboardPage } from '@/features/superadmin/pages/dashboard-page';
import { SuperAdminLoginPage } from '@/features/superadmin/pages/login-page';
import { PlanSettingsPage } from '@/features/superadmin/pages/plan-settings-page';
import { SystemHealthPage } from '@/features/superadmin/pages/system-health-page';
import SuperAdminPage from './pages/SuperAdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider delayDuration={0}>
        <SuperAdminAuthProvider>
          <Toaster position="top-right" richColors closeButton />
          <Routes>
            <Route path="/" element={<SuperAdminPage />} />
            <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
            <Route path="/superadmin" element={<SuperAdminLayout />}>
              <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="companies/:id" element={<CompanyDetailPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="plan-settings" element={<PlanSettingsPage />} />
              <Route path="admins" element={<AdminsPage />} />
              <Route path="system-health" element={<SystemHealthPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/superadmin/dashboard" replace />} />
          </Routes>
        </SuperAdminAuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}
