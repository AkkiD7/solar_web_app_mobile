import {
  Activity, Building2, FileClock, HeartPulse,
  LayoutDashboard, Settings, Shield, UserCog, HelpCircle, LogOut
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useSuperAdminAuth } from '@/features/auth/auth-context';

const navGroups = [
  {
    label: 'Command Center',
    items: [
      { title: 'Overview', url: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Company Management',
    items: [
      { title: 'Company Management', url: '/companies', icon: Building2 },
      { title: 'Plan Settings', url: '/plan-settings', icon: Settings },
    ],
  },
  {
    label: 'Platform',
    items: [
      { title: 'Audit Logs', url: '/audit-logs', icon: FileClock },
      { title: 'Admins', url: '/admins', icon: UserCog },
    ],
  },
  {
    label: 'System',
    items: [{ title: 'System Health', url: '/system-health', icon: HeartPulse }],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useSuperAdminAuth();

  return (
    <Sidebar className="border-r border-outline-variant/60 bg-surface-container-low">
      <SidebarHeader className="px-6 py-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded bg-primary text-on-primary">
            <Shield className="size-5" />
          </div>
          <div className="min-w-0 group-data-[state=collapsed]/sidebar-wrapper:hidden">
            <h2 className="font-page-title text-[18px] font-bold text-on-surface leading-tight tracking-tight">Solar Admin</h2>
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant/60 font-medium">Super Admin</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 gap-0">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="pt-0 pb-4">
            <SidebarGroupLabel className="font-label-caps text-label-caps text-on-surface-variant/50 uppercase px-3 mb-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const active = location.pathname === item.url || location.pathname.startsWith(`${item.url}/`);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton 
                        isActive={active} 
                        tooltip={item.title} 
                        onClick={() => navigate(item.url)}
                        className={cn(
                          "h-auto px-3 py-2.5 rounded-lg font-medium transition-colors gap-3",
                          active 
                            ? "text-primary font-bold border-l-2 border-primary bg-surface-container-high rounded-l-none rounded-r-lg data-[active=true]:bg-surface-container-high data-[active=true]:text-primary" 
                            : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface data-[active=true]:bg-transparent"
                        )}
                      >
                        <item.icon className="size-5" />
                        <span className="font-body text-body truncate group-data-[state=collapsed]/sidebar-wrapper:hidden">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="px-4 pb-6 mt-auto">
        <div className="group-data-[state=collapsed]/sidebar-wrapper:hidden space-y-1">
          <div className="mb-6 p-4 rounded-xl bg-primary/20 border border-primary/20">
            <p className="text-[12px] font-bold text-primary mb-2">Upgrade Plan</p>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">Unlock advanced analytics and multi-region support.</p>
          </div>
          
          <button className="flex w-full items-center gap-3 text-on-surface-variant font-medium px-4 py-2 hover:text-primary transition-colors rounded-lg">
            <HelpCircle className="size-5" />
            <span className="font-body text-body">Support</span>
          </button>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }} 
            className="flex w-full items-center gap-3 text-on-surface-variant font-medium px-4 py-2 hover:text-error transition-colors rounded-lg"
          >
            <LogOut className="size-5" />
            <span className="font-body text-body">Log out</span>
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
