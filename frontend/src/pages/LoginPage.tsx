import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../shared/ui/button';
import { Input } from '../shared/ui/input';
import { Label } from '../shared/ui/label';
import { authApi } from '../features/auth/api/auth.api';
import { useAuthStore } from '../features/auth/hooks/useAuth';

const schema = yup.object({
  email: yup.string().email('Valid email required').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const result = await authApi.login(data);
      setAuth(result.token, result.user);
      navigate('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-text tracking-tight">Welcome back</h1>
        <p className="text-textSoft font-medium mt-2">Sign in to your Solar Contractor account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="login-email" className="text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">Email</Label>
          <Input id="login-email" type="email" placeholder="you@company.com" {...register('email')} />
          {errors.email && <p className="text-xs text-danger font-medium mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password" className="text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">Password</Label>
          <Input id="login-password" type="password" placeholder="••••••••" {...register('password')} />
          {errors.password && <p className="text-xs text-danger font-medium mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="pt-6 mt-6 border-t border-border/60 text-center">
        <p className="text-xs font-bold tracking-widest text-textSoft uppercase">
          Secure Access Only
        </p>
      </div>
    </div>
  );
}
