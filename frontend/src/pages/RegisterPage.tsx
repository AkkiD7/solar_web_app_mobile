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
  name: yup.string().min(2, 'Minimum 2 characters').required('Name is required'),
  email: yup.string().email('Valid email required').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: { name: string; email: string; password: string }) => {
    try {
      const result = await authApi.register(data);
      setAuth(result.token, result.user);
      navigate('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-text tracking-tight">Create your account</h1>
        <p className="text-textSoft font-medium mt-1">Start managing your solar leads today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reg-name" className="text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">Full Name</Label>
          <Input id="reg-name" placeholder="Sunil Sharma" {...register('name')} />
          {errors.name && <p className="text-xs text-danger font-medium mt-1 ml-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-email" className="text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">Email</Label>
          <Input id="reg-email" type="email" placeholder="sunil@solar.com" {...register('email')} />
          {errors.email && <p className="text-xs text-danger font-medium mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-password" className="text-[11px] font-bold uppercase tracking-[1.1px] text-textMuted ml-1">Password</Label>
          <Input id="reg-password" type="password" placeholder="Min. 6 characters" {...register('password')} />
          {errors.password && <p className="text-xs text-danger font-medium mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-sm font-medium text-textSoft">
        Already have an account?{' '}
        <a href="/login" className="text-primary-strong font-bold hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
