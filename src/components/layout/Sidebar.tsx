import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Truck,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Shirt,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/companies', label: 'Companies', icon: Building2 },
  { path: '/properties', label: 'Properties', icon: Building2 },
  { path: '/collections', label: 'Collections', icon: Truck },
  { path: '/admin', label: 'Admin', icon: Users },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-transparent overflow-hidden">
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
                    logoWrapper.className = "flex items-center justify-center w-full h-full text-white font-bold text-xl select-none";
                    logoWrapper.innerHTML = `
                      <svg viewBox="0 0 100 100" class="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div>
              <h1 className="font-semibold text-sidebar-foreground">EasyLaundry</h1>
              <p className="text-xs text-sidebar-muted">Operations Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'nav-item',
                    isActive && 'nav-item-active'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
                <p className="text-xs text-sidebar-muted truncate">admin@laundryops.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
