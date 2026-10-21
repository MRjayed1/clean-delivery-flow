import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Truck, ShieldCheck, LogOut, Phone, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerUser } from '@/lib/customerData';

interface CustomerNavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currentUser: CustomerUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export function CustomerNavbar({
  cartCount,
  onOpenCart,
  currentUser,
  onOpenAuthModal,
  onLogout,
}: CustomerNavbarProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-primary/5 via-background/95 to-primary/5 backdrop-blur-md border-b border-primary/10 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Switch to Admin */}
          <div className="flex items-center gap-4">
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground tracking-tight flex items-center gap-1.5">
                  EasyLaundry <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">Store</span>
                </span>
                <p className="text-[11px] text-muted-foreground hidden sm:block">Ordinary Washing & Ironing Services</p>
              </div>
            </NavLink>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors hover:text-primary ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`
              }
            >
              Laundry Services
            </NavLink>
            <NavLink
              to="/track-order"
              className={({ isActive }) =>
                `flex items-center gap-1.5 transition-colors hover:text-primary ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`
              }
            >
              <Truck className="w-4 h-4 text-blue-500" />
              Track My Order
            </NavLink>
            <a
              href="https://m.me/61590380342190"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-blue-500"
              >
                <path d="M12 2C6.477 2 2 6.145 2 11.26c0 2.916 1.488 5.485 3.791 7.159v4.208l3.473-1.921c.866.242 1.782.374 2.736.374 5.523 0 10-4.145 10-9.26S17.523 2 12 2zm1.094 12.338l-2.793-2.986-5.445 2.986 5.975-6.353 2.83 2.986 5.404-2.986-5.971 6.353z"/>
              </svg>
              Talk with us
            </a>
          </div>

          {/* Right Action Controls: Cart, User Auth, Admin Switch */}
          <div className="flex items-center gap-3">
            
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 border-primary/20 hover:border-primary/40"
            >
              <ShoppingCart className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Auth / Account Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-foreground">{currentUser.name}</span>
                  <span className="text-[10px] text-muted-foreground">{currentUser.phone}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  title="Sign Out Customer Account"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="default"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </Button>
            )}

            {/* Switch to Admin Portal Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/login')}
              className="hidden lg:flex items-center gap-1 text-xs bg-muted hover:bg-muted/80 text-foreground"
              title="Switch to Admin Operations Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Portal</span>
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
}
