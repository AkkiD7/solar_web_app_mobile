import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Sun, Settings, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../features/auth/hooks/useAuth';
import { cn } from '../ui/cn';
import { StatusPill } from '../ui/StatusPill';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Users, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const renderNavLinks = () => (
    <nav className="flex-1 px-3 py-4 space-y-1.5">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={closeMobileMenu}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-3 rounded-[16px] text-[15px] font-bold transition-all duration-200',
              isActive
                ? 'bg-primary-soft text-primary-strong'
                : 'text-textMuted hover:bg-surfaceMuted hover:text-text'
            )
          }
        >
          <Icon className="w-5 h-5 shrink-0" strokeWidth={2.5} />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Top Header */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-[72px] bg-surface border-b border-border flex items-center justify-between px-4 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-soft rounded-[14px] flex items-center justify-center">
            <Sun className="w-6 h-6 text-primary-strong" />
          </div>
          <span className="font-black text-text text-lg">Solar Pro</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-text">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Overlay) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-[280px] bg-surface border-r border-border flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-floating lg:shadow-none',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="h-[88px] px-6 border-b border-border flex items-center">
          <div className="flex items-center gap-3">
            {user?.companyLogo ? (
              <img
                src={user.companyLogo}
                alt={user.companyName}
                className="w-[42px] h-[42px] rounded-2xl object-contain bg-surfaceMuted p-1"
              />
            ) : (
              <div className="w-[42px] h-[42px] bg-gradient-to-br from-primary-soft to-white border border-border/60 rounded-[14px] flex items-center justify-center shadow-sm">
                <Sun className="w-6 h-6 text-primary-strong" strokeWidth={2.5} />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-text font-black text-base leading-tight truncate">
                {user?.companyName ?? 'Solar Pro'}
              </p>
              <p className="text-textSoft text-[11px] font-bold uppercase tracking-widest mt-0.5 leading-tight">
                Console
              </p>
            </div>
          </div>
        </div>

        {renderNavLinks()}

        {/* User profile & Logout */}
        <div className="p-5 border-t border-border bg-surfaceMuted/30">
          {user?.plan && (
            <div className="mb-4">
              <StatusPill label={`${user.plan} PLAN`} tone="info" className="w-full" />
            </div>
          )}
          
          <div className="flex items-center gap-3 px-1 mb-4">
            <div className="w-10 h-10 bg-primary-strong rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-text text-sm font-bold truncate">{user?.name}</p>
              <p className="text-textMuted text-xs font-medium truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-[14px] font-bold text-textSoft hover:text-danger hover:bg-danger-soft transition-all duration-200"
          >
            <LogOut className="w-4 h-4" strokeWidth={2.5} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile backdrop overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-text/20 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative lg:pt-0 pt-[72px]">
        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 pb-20">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
