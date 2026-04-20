import { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, Shield, Plus, RefreshCw, Loader2, LogOut, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BASE = '/api/superadmin';

interface Company {
  _id: string;
  name: string;
  email: string;
  phone: string;
  plan: 'FREE' | 'STARTER' | 'PRO';
  status: 'ACTIVE' | 'SUSPENDED';
  userCount: number;
  leadCount: number;
  createdAt: string;
}

interface GlobalStats {
  totalCompanies: number;
  activeCompanies: number;
  suspendedCompanies: number;
  totalLeads: number;
  totalQuotes: number;
  totalRevenue: number;
  planBreakdown: Record<string, number>;
}

const planBadge: Record<string, string> = {
  FREE: 'bg-slate-100 text-slate-600',
  STARTER: 'bg-blue-100 text-blue-700',
  PRO: 'bg-orange-100 text-orange-700',
};

const statusBadge: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  SUSPENDED: 'bg-red-100 text-red-700',
};

// ── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE}/login`, { email, password });
      onLogin(res.data.data.token);
      toast.success('Welcome, Super Admin');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base">Super Admin</p>
            <p className="text-slate-400 text-xs">Platform Control Center</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm font-medium">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              placeholder="admin@domain.com"
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm font-medium">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Create Company Modal ──────────────────────────────────────────────────────
function CreateCompanyModal({ token, onClose, onCreated }: { token: string; onClose: () => void; onCreated: () => void }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [company, setCompany] = useState({ name: '', email: '', phone: '', address: '', plan: 'FREE' });
  const [companyId, setCompanyId] = useState('');
  const [admin, setAdmin] = useState({ name: '', email: '', password: '' });

  const createCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE}/companies`, company, { headers: { Authorization: `Bearer ${token}` } });
      setCompanyId(res.data.data._id);
      toast.success('Company created! Now add an admin user.');
      setStep(2);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE}/companies/${companyId}/users`, admin, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Admin user created! Company is ready.');
      onCreated();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        {/* Steps */}
        <div className="flex gap-2 mb-6">
          {(['Company Details', 'Admin User'] as const).map((label, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full ${step > i ? 'bg-orange-500' : 'bg-slate-200'}`} />
          ))}
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">{step === 1 ? '1. Company Details' : '2. Create Admin User'}</h2>
        <p className="text-slate-500 text-sm mb-5">{step === 1 ? 'Enter the contractor company information' : 'Create the admin login for this company'}</p>

        {step === 1 ? (
          <form onSubmit={createCompany} className="space-y-4">
            {[
              { label: 'Company Name', key: 'name', placeholder: 'Bright Solar Co.' },
              { label: 'Email', key: 'email', placeholder: 'info@brightsolar.com' },
              { label: 'Phone', key: 'phone', placeholder: '+91 98765 43210' },
              { label: 'Address', key: 'address', placeholder: '123 Solar Street, Mumbai' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-sm font-medium text-slate-700">{label}</label>
                <input
                  required value={(company as any)[key]} onChange={e => setCompany(c => ({ ...c, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium text-slate-700">Plan</label>
              <select
                value={company.plan} onChange={e => setCompany(c => ({ ...c, plan: e.target.value }))}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="FREE">FREE</option>
                <option value="STARTER">STARTER</option>
                <option value="PRO">PRO</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Creating…' : 'Next →'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={createAdmin} className="space-y-4">
            {[
              { label: 'Name', key: 'name', type: 'text', placeholder: 'Raj Kumar' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'raj@brightsolar.com' },
              { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-sm font-medium text-slate-700">{label}</label>
                <input
                  required type={type} value={(admin as any)[key]} onChange={e => setAdmin(a => ({ ...a, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">← Back</button>
              <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Creating…' : 'Create Admin'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, companiesRes] = await Promise.all([
        axios.get(`${BASE}/stats`, { headers }),
        axios.get(`${BASE}/companies`, { headers }),
      ]);
      setStats(statsRes.data.data);
      setCompanies(companiesRes.data.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: 'ACTIVE' | 'SUSPENDED') => {
    setActionLoading(id + '_status');
    try {
      await axios.patch(`${BASE}/companies/${id}/status`, { status }, { headers });
      toast.success(`Company ${status.toLowerCase()}`);
      fetchData();
    } catch { toast.error('Failed to update'); }
    finally { setActionLoading(null); }
  };

  const updatePlan = async (id: string, plan: string) => {
    setActionLoading(id + '_plan');
    try {
      await axios.patch(`${BASE}/companies/${id}/plan`, { plan }, { headers });
      toast.success('Plan updated');
      fetchData();
    } catch { toast.error('Failed to update plan'); }
    finally { setActionLoading(null); }
  };

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Super Admin</p>
            <p className="text-slate-500 text-xs">Platform Control Center</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white text-sm rounded-xl hover:bg-slate-800 transition">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition">
            <Plus className="w-4 h-4" /> New Company
          </button>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-400 text-sm rounded-xl hover:bg-red-500/10 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: 'Total Companies', value: stats.totalCompanies, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Active Companies', value: stats.activeCompanies, icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
              { label: 'Total Leads', value: stats.totalLeads, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: 'Platform Revenue', value: fmt(stats.totalRevenue), icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Companies table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Companies</h2>
            <span className="text-sm text-slate-500">{companies.length} total</span>
          </div>
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Company', 'Plan', 'Status', 'Users', 'Leads', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {companies.map(c => (
                    <tr key={c._id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                        <p className="text-slate-400 text-xs">{c.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={c.plan}
                          onChange={e => updatePlan(c._id, e.target.value)}
                          disabled={actionLoading === c._id + '_plan'}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border-0 cursor-pointer focus:outline-none ${planBadge[c.plan]}`}
                        >
                          <option value="FREE">FREE</option>
                          <option value="STARTER">STARTER</option>
                          <option value="PRO">PRO</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[c.status]}`}>{c.status}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{c.userCount}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{c.leadCount}</td>
                      <td className="px-5 py-4">
                        {c.status === 'ACTIVE' ? (
                          <button
                            onClick={() => updateStatus(c._id, 'SUSPENDED')}
                            disabled={actionLoading === c._id + '_status'}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition disabled:opacity-50"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(c._id, 'ACTIVE')}
                            disabled={actionLoading === c._id + '_status'}
                            className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 font-medium transition disabled:opacity-50"
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <CreateCompanyModal
          token={token}
          onClose={() => setShowModal(false)}
          onCreated={fetchData}
        />
      )}
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function SuperAdminPage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sa_token'));

  const handleLogin = (t: string) => {
    localStorage.setItem('sa_token', t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem('sa_token');
    setToken(null);
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
