import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Sun, Settings } from 'lucide-react';
import { useAuthStore } from '../../features/auth/hooks/useAuth';
import { cn } from '../ui/cn';

const planColors: Record<string, string> = {
  FREE: 'bg-slate-700 text-slate-300',
  STARTER: 'bg-blue-500/20 text-blue-300',
  PRO: 'bg-orange-500/20 text-orange-300',
};

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Users, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-slate-900 flex flex-col">
        {/* Company Logo / Brand */}
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {user?.companyLogo ? (
              <img
                src={user.companyLogo}
                alt={user.companyName}
                className="w-9 h-9 rounded-xl object-contain bg-white/10 p-0.5"
              />
            ) : (
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
                <Sun className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">
                {user?.companyName ?? 'Solar Pro'}
              </p>
              <p className="text-slate-500 text-xs leading-tight">Contractor Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Plan badge + User + Logout */}
        <div className="px-4 py-4 border-t border-slate-800 space-y-3">
          {/* Plan badge */}
          {user?.plan && (
            <div className={cn('mx-1 px-3 py-1.5 rounded-lg text-center text-xs font-bold tracking-wide', planColors[user.plan] ?? planColors.FREE)}>
              {user.plan} PLAN
            </div>
          )}

          {/* User info */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 bg-linear-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-slate-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
