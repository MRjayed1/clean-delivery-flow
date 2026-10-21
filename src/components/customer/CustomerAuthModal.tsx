import { useState } from 'react';
import { X, User, Phone, Lock, Mail, MapPin, CheckCircle2, ShieldAlert, KeyRound, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomerUser } from '@/lib/customerData';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessAuth: (user: CustomerUser) => void;
}

export function CustomerAuthModal({ isOpen, onClose, onSuccessAuth }: CustomerAuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [step, setStep] = useState<'form' | 'verify'>('form');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleStartAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (tab === 'register' && (!name || !phone || !password)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (tab === 'signin' && (!phone || !password)) {
      setError('Please enter your phone number and password.');
      return;
    }

    // Move to simulated OTP verification step
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpCode || otpCode.length < 4) {
      setError('Please enter a valid 4-digit verification code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const authenticatedUser: CustomerUser = {
        id: 'cust-' + Date.now(),
        name: name || 'Customer',
        phone: phone || '+880 1700-000000',
        email: email || 'customer@example.com',
        address: address || 'Dhaka, Bangladesh',
        isVerified: true,
      };

      // Store customer session
      localStorage.setItem('currentCustomer', JSON.stringify(authenticatedUser));
      onSuccessAuth(authenticatedUser);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 relative text-left">
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>

          {step === 'form' ? (
            <>
              {/* Header & Tabs */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Customer Verification</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Sign in or register to place your laundry order & track status
                </p>
              </div>

              {/* Tabs selector */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl mb-5 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => { setTab('signin'); setError(''); }}
                  className={`py-2 rounded-lg text-center transition-all ${
                    tab === 'signin'
                      ? 'bg-background text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('register'); setError(''); }}
                  className={`py-2 rounded-lg text-center transition-all ${
                    tab === 'register'
                      ? 'bg-background text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  New Customer
                </button>
              </div>

              {error && (
                <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStartAuth} className="space-y-4">
                {tab === 'register' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="cust-name">Full Name *</Label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
                      <Input
                        id="cust-name"
                        placeholder="e.g. Rafiqul Islam"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9 h-11"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="cust-phone">Mobile Phone Number (BD) *</Label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
                    <Input
                      id="cust-phone"
                      type="tel"
                      placeholder="+880 1712-345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9 h-11"
                      required
                    />
                  </div>
                </div>

                {tab === 'register' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="cust-address">Delivery Address</Label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
                      <Input
                        id="cust-address"
                        placeholder="House / Flat #, Road #, Area (e.g. Gulshan, Dhaka)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="pl-9 h-11"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="cust-password">Password *</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
                    <Input
                      id="cust-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 h-11"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-11 text-sm font-semibold mt-2">
                  {isLoading ? 'Sending SMS Code...' : tab === 'register' ? 'Register & Verify SMS' : 'Sign In & Verify'}
                </Button>
              </form>
            </>
          ) : (
            /* Step 2: Verification Code Input */
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Enter Verification Code</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                We sent a 4-digit security OTP code to <strong className="text-foreground">{phone || '+880 17XX-XXXXXX'}</strong>.
              </p>

              {error && (
                <div className="p-3 my-4 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">4-Digit Security OTP (Demo Code: 1234)</Label>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={4}
                    placeholder="1234"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="h-12 text-center text-xl font-mono tracking-widest font-bold"
                    autoFocus
                  />
                  <p className="text-[11px] text-muted-foreground">Type <strong>1234</strong> to verify instant demo session</p>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-11 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700">
                  {isLoading ? 'Verifying Account...' : 'Confirm Verification & Continue'}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-xs text-muted-foreground hover:text-foreground mt-2"
                >
                  ← Back to phone number
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
