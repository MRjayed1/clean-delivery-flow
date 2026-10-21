import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, User } from 'lucide-react';
import { authenticateAdmin, demoAdminAccounts } from '@/lib/mockData';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const admin = authenticateAdmin(email.trim(), password.trim());
      
      if (admin) {
        localStorage.setItem('currentAdmin', JSON.stringify(admin));
        if (admin.role === 'employee') {
          navigate('/properties');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleDemoClick = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="dashboard-card p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-transparent mb-4 overflow-hidden shadow-sm">
              <img 
                src="/logu.svg/Gemini_Generated_Image_oy1oqsoy1oqsoy1o (1).png" 
                alt="EasyLaundry Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.classList.add('bg-gradient-to-br', 'from-primary', 'to-blue-600');
                    const logoWrapper = document.createElement('div');
                    logoWrapper.className = "flex items-center justify-center w-full h-full text-white font-bold select-none";
                    logoWrapper.innerHTML = `
                      <svg viewBox="0 0 100 100" class="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="6" />
                        <path d="M40 30V70H65" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M30 80C40 75 60 75 70 80" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
                      </svg>
                    `;
                    parent.appendChild(logoWrapper);
                  }
                }}
              />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">EasyLaundry</h1>
            <p className="text-muted-foreground mt-1">Admin Portal</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Admin Accounts — clickable to auto-fill */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">Quick Login — click to auto-fill:</p>
            <div className="space-y-2">
              {demoAdminAccounts.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => handleDemoClick(demo.email, demo.password)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{demo.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{demo.email}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0 capitalize">
                    {demo.role === 'employee' ? 'Employee' : 'Admin'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Forgot Password */}
          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-primary hover:underline"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2025 LaundryOps. All rights reserved.
        </p>
      </div>
    </div>
  );
}
