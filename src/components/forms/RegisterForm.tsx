'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';
import { User, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

interface RegisterFormProps {
  role: 'client' | 'lawyer';
}

export function RegisterForm({ role }: RegisterFormProps) {
  const register = useAuthStore((state) => state.register);
  const pushToast = useNotificationStore((state) => state.pushToast);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register({ ...form, role: role === 'client' ? 'client' : 'lawyer' });
      pushToast({ title: 'OTP sent', description: 'Please verify the code sent to your email.', variant: 'info' });
      // Redirect after registration for client, admin, and lawyer
      if (role === 'client') {
        router.push('/user/dashboard');
      
      } else if (role === 'lawyer') {
        router.push('/lawyer/profile');
      }
    } catch (error) {
      pushToast({ title: 'Could not register', description: (error as Error).message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Full name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            required 
            name="name" 
            placeholder="Aisha Khan" 
            value={form.name} 
            onChange={handleChange} 
            className="pl-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Email address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            required 
            name="email" 
            type="email" 
            placeholder="you@vakeel.pro" 
            value={form.email} 
            onChange={handleChange} 
            className="pl-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            required
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleChange}
            className="pl-10 pr-12"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
          </button>
        </div>
        <p className="text-xs text-slate-500">Must be at least 8 characters</p>
      </div>
      <Button className="w-full h-11" type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  );
}
