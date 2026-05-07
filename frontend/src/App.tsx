import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SuperAdminAuthProvider } from '@/features/auth/auth-context';
import { SuperAdminLayout } from '@/features/layout/layout';
import { LoginPage } from '@/features/auth/login-page';
import { LoadingState } from '@/features/shared/components/loading-state';

// A8 fix: Lazy-load pages for better initial load performance
const DashboardPage = lazy(() => import('@/features/dashboard/dashboard-page').then((m) => ({ default: m.DashboardPage })));
const CompaniesPage = lazy(() => import('@/features/companies/companies-page').then((m) => ({ default: m.CompaniesPage })));
const CompanyDetailPage = lazy(() => import('@/features/companies/company-detail-page').then((m) => ({ default: m.CompanyDetailPage })));
const AuditLogsPage = lazy(() => import('@/features/audit/audit-logs-page').then((m) => ({ default: m.AuditLogsPage })));
const ActivityPage = lazy(() => import('@/features/audit/activity-page').then((m) => ({ default: m.ActivityPage })));
const PlanSettingsPage = lazy(() => import('@/features/plans/plan-settings-page').then((m) => ({ default: m.PlanSettingsPage })));
const AdminsPage = lazy(() => import('@/features/admins/admins-page').then((m) => ({ default: m.AdminsPage })));
const SystemHealthPage = lazy(() => import('@/features/system/system-health-page').then((m) => ({ default: m.SystemHealthPage })));

function LazyFallback() {
  return <div className="p-6"><LoadingState rows={6} /></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider delayDuration={0}>
        <SuperAdminAuthProvider>
          <Toaster position="top-right" richColors closeButton />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<SuperAdminLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Suspense fallback={<LazyFallback />}><DashboardPage /></Suspense>} />
              <Route path="companies" element={<Suspense fallback={<LazyFallback />}><CompaniesPage /></Suspense>} />
              <Route path="companies/:id" element={<Suspense fallback={<LazyFallback />}><CompanyDetailPage /></Suspense>} />
              <Route path="audit-logs" element={<Suspense fallback={<LazyFallback />}><AuditLogsPage /></Suspense>} />
              <Route path="activity" element={<Suspense fallback={<LazyFallback />}><ActivityPage /></Suspense>} />
              <Route path="plan-settings" element={<Suspense fallback={<LazyFallback />}><PlanSettingsPage /></Suspense>} />
              <Route path="admins" element={<Suspense fallback={<LazyFallback />}><AdminsPage /></Suspense>} />
              <Route path="system-health" element={<Suspense fallback={<LazyFallback />}><SystemHealthPage /></Suspense>} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </SuperAdminAuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}
