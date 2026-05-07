import { KeyRound, LogOut, Moon, RefreshCw, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  SidebarDesktopTrigger, SidebarInset, SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar';
import { SUPERADMIN_THEME_KEY } from '@/features/shared/api/client';
import { ErrorBoundary } from '@/features/shared/components/error-boundary';
import { useSuperAdminAuth } from '@/features/auth/auth-context';
import { AppSidebar } from './app-sidebar';
import { PasswordDialog } from './password-dialog';
import { cn } from '@/lib/utils';

export function SuperAdminLayout() {
  const { token, logout } = useSuperAdminAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem(SUPERADMIN_THEME_KEY) !== 'light');
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(SUPERADMIN_THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant/60 bg-surface/80 px-8 backdrop-blur-md supports-[backdrop-filter]:bg-surface/80">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <SidebarDesktopTrigger />
            <Separator orientation="vertical" className="h-6 mx-2 bg-outline-variant/60" />
            <div className="relative group hidden sm:block">
              <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant/60">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input 
                type="text"
                placeholder="Search resources..." 
                className="bg-surface-high border border-outline-variant/40 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64 text-on-surface" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-on-surface-variant">
              <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">notifications</span></button>
              <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">apps</span></button>
              
              <Button variant="ghost" size="icon" onClick={() => window.location.reload()} title="Refresh page" className="hover:text-primary hover:bg-transparent">
                <RefreshCw className="size-[20px]" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDark((value) => !value)} title="Toggle theme" className="hover:text-primary hover:bg-transparent">
                {dark ? <Sun className="size-[20px]" /> : <Moon className="size-[20px]" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setPasswordOpen(true)} title="Change password" className="hover:text-primary hover:bg-transparent">
                <KeyRound className="size-[20px]" />
              </Button>
              
              <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant ml-2">
                <img alt="Admin User Avatar" className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=Super+Admin&background=6366f1&color=fff" />
              </div>
              
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className={cn('text-error hover:text-error hover:bg-error/10 ml-1')}>
                <LogOut className="size-[20px]" />
              </Button>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8 max-w-[1400px]">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </SidebarInset>
      <PasswordDialog token={token} open={passwordOpen} onOpenChange={setPasswordOpen} />
    </SidebarProvider>
  );
}
