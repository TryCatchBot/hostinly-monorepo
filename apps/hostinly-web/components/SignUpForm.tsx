'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isLoading } = useAuth();
  const roleParam = searchParams?.get('role');
  const initialRole: 'host' | 'cohost' =
    roleParam === 'cohost' ? 'cohost' : 'host';
  
  const [step, setStep] = useState<0 | 1>(roleParam ? 1 : 0);
  const [account, setAccount] = useState({
    full_name: '',
    phone_number: '',
    email_address: '',
    password: '',
    confirmPassword: '',
    userType: (roleParam === 'cohost' || roleParam === 'cleaner' ? roleParam : 'host') as 'host' | 'cohost' | 'cleaner',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
      return;
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    if (step === 1 && roleParam) {
      router.push('/login');
      return;
    }
    setStep(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 0) {
      handleNext();
      return;
    }

    if (
      !account.full_name ||
      !account.phone_number ||
      !account.email_address ||
      !account.password ||
      !account.confirmPassword
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validatePassword(account.password)) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (account.password !== account.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await signup(
        account.email_address,
        account.password,
        account.full_name,
        account.userType,
        {
          phone: account.phone_number,
        }
      );

      toast.success('Account created successfully! Please log in.');
      router.push('/login');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sign up failed');
    }
  };

  const passwordValid = account.password && validatePassword(account.password);
  const passwordsMatch =
    account.password &&
    account.confirmPassword &&
    account.password === account.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/hostinly-logo.png"
              alt="Hostinly"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold text-primary">Hostinly</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-background rounded-lg shadow-medium p-8 border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {step === 0 ? 'Choose your role' : 'Create your account'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {step === 0
              ? 'Tell us what you want to do on Hostinly.'
              : 'Create your login details.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 0 && (
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setAccount((p) => ({ ...p, userType: 'host' }))
                  }
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    account.userType === 'host'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="font-semibold text-foreground mb-1">
                    Property Owner
                  </div>
                  <div className="text-sm text-muted-foreground">
                    List a property and find trusted co-hosts.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAccount((p) => ({ ...p, userType: 'cohost' }))
                  }
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    account.userType === 'cohost'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="font-semibold text-foreground mb-1">
                    Co-Host
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Apply to manage properties and earn.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAccount((p) => ({ ...p, userType: 'cleaner' }))
                  }
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    account.userType === 'cleaner'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="font-semibold text-foreground mb-1">
                    Cleaner
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Offer cleaning services to property owners.
                  </div>
                </button>
              </div>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={account.full_name}
                    onChange={(e) =>
                      setAccount((p) => ({ ...p, full_name: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={account.phone_number}
                    onChange={(e) =>
                      setAccount((p) => ({
                        ...p,
                        phone_number: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="+44 7..."
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={account.email_address}
                    onChange={(e) =>
                      setAccount((p) => ({
                        ...p,
                        email_address: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={account.password}
                      onChange={(e) =>
                        setAccount((p) => ({
                          ...p,
                          password: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      passwordValid ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    {passwordValid && <Check size={14} />}
                    At least 8 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={account.confirmPassword}
                      onChange={(e) =>
                        setAccount((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      passwordsMatch ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    {passwordsMatch && <Check size={14} />}
                    Passwords match
                  </p>
                </div>
              </>
            )}

            <div className="pt-4 flex flex-col gap-3">
              <Button
                type="submit"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                  color: '#ffffff',
                }}
                className="w-full py-6 text-lg font-semibold rounded-xl shadow-lg hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Processing...
                  </div>
                ) : step === 0 ? (
                  'Continue'
                ) : (
                  'Register'
                )}
              </Button>

              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                disabled={isLoading}
              >
                {step === 0 ? (
                  <span>
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary font-semibold">
                      Log in
                    </Link>
                  </span>
                ) : (
                  'Go back'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
