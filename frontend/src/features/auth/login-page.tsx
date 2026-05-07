import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getErrorMessage } from '@/features/shared/api/client';
import { TextField } from '@/features/shared/components/form-fields';
import { useSuperAdminAuth } from './auth-context';
import { login as loginApi } from './api';

export function LoginPage() {
  const { token, login } = useSuperAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await loginApi(email, password);
      login(result.token);
      toast.success('Welcome, Super Admin');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Invalid credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-on-surface font-body selection:bg-primary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-glow pointer-events-none"></div>
      
      <main className="relative z-10 w-full max-w-[400px] px-6">
        <div className="bg-surface border border-border rounded-xl shadow-2xl p-10 flex flex-col items-center">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-6 border border-primary/20">
            <Shield className="size-5 text-primary" style={{ fill: 'currentColor' }} />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="font-page-title text-page-title text-white mb-2">Super Admin</h1>
            <p className="font-body text-text-secondary">Sign in to the platform control center.</p>
          </div>
          
          <form onSubmit={submit} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase" htmlFor="email">
                Email Address
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="admin@solar.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface-container border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-white placeholder:text-text-secondary/50 outline-none transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase" htmlFor="password">
                  Password
                </label>
                <a className="text-[11px] font-medium text-primary hover:text-primary-container transition-colors" href="#">
                  Forgot password?
                </a>
              </div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface-container border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-white placeholder:text-text-secondary/50 outline-none transition-all duration-200"
              />
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#8083ff] text-[#0d0096] font-semibold rounded-lg px-6 py-3.5 flex items-center justify-center gap-2 hover:bg-[#c0c1ff] active:scale-[0.98] transition-all duration-200 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="size-[18px] animate-spin" /> : <Shield className="size-[18px] group-hover:scale-110 transition-transform" style={{ fill: 'currentColor' }} />}
                Sign In
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-8 border-t border-border/50 w-full text-center">
            <p className="font-label-caps text-label-caps text-text-secondary/60 tracking-widest uppercase">
              Access Restricted to Super Administrators
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <div className="w-24 h-8 bg-surface-container rounded-md flex items-center justify-center">
            <span className="font-page-title text-[10px] font-extrabold text-on-surface tracking-tighter">SOLAR OPS</span>
          </div>
        </div>
      </main>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}
