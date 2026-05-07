import {
  Activity,
  Building2,
  FileClock,
  HeartPulse,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Moon,
  RefreshCw,
  Settings,
  Shield,
  Sun,
  UserCog,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarDesktopTrigger,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SUPERADMIN_THEME_KEY } from './api';
import { useSuperAdminAuth } from './auth';
import { PasswordDialog } from './components/password-dialog';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', url: '/superadmin/dashboard', icon: LayoutDashboard },
      { title: 'Activity', url: '/superadmin/activity', icon: Activity },
    ],
  },
  {
    label: 'Company Management',
    items: [
      { title: 'Companies', url: '/superadmin/companies', icon: Building2 },
      { title: 'Plan Settings', url: '/superadmin/plan-settings', icon: Settings },
    ],
  },
  {
    label: 'Platform',
    items: [
      { title: 'Audit Logs', url: '/superadmin/audit-logs', icon: FileClock },
      { title: 'Admins', url: '/superadmin/admins', icon: UserCog },
    ],
  },
  {
    label: 'System',
    items: [{ title: 'System Health', url: '/superadmin/system-health', icon: HeartPulse }],
  },
];

function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 rounded-md px-2 py-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Shield className="size-5" />
          </div>
          <div className="min-w-0 group-data-[state=collapsed]/sidebar-wrapper:hidden">
            <div className="truncate text-sm font-semibold">Super Admin</div>
            <div className="truncate text-xs text-sidebar-foreground/60">Control Center</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = location.pathname === item.url || location.pathname.startsWith(`${item.url}/`);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton isActive={active} tooltip={item.title} onClick={() => navigate(item.url)}>
                        <item.icon className="size-4" />
                        <span className="truncate group-data-[state=collapsed]/sidebar-wrapper:hidden">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="rounded-md border border-sidebar-border p-3 text-xs text-sidebar-foreground/70 group-data-[state=collapsed]/sidebar-wrapper:hidden">
          API proxy: localhost:5000
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function SuperAdminLayout() {
  const { token, logout } = useSuperAdminAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem(SUPERADMIN_THEME_KEY) === 'dark');
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(SUPERADMIN_THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  if (!token) {
    return <Navigate to="/superadmin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/superadmin/login', { replace: true });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <SidebarTrigger />
            <SidebarDesktopTrigger />
            <Separator orientation="vertical" className="h-6" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Solar Contractor Platform</p>
              <p className="truncate text-xs text-muted-foreground">Super-admin workspace</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => window.location.reload()} title="Refresh page">
              <RefreshCw className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDark((value) => !value)} title="Toggle theme">
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setPasswordOpen(true)} title="Change password">
              <KeyRound className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className={cn('text-destructive hover:text-destructive')}>
              <LogOut className="size-4" />
            </Button>
          </header>
          <div className="flex-1 p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
        <PasswordDialog token={token} open={passwordOpen} onOpenChange={setPasswordOpen} />
      </SidebarProvider>
    </TooltipProvider>
  );
}
