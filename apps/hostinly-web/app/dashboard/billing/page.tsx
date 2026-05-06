'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CreditCard, Download, AlertCircle, CheckCircle, Globe } from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

interface BillingInfo {
  cardType: string;
  cardLast4: string;
  cardExpiry: string;
  totalPaid: number;
  pendingBalance: number;
  overdueBalance: number;
}

const CURRENCY_RATES: { [key: string]: number } = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 149.5,
};

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
};

export default function BillingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [currency, setCurrency] = useState(() => {
    if (typeof window === 'undefined') return 'USD';
    return localStorage.getItem('hostinly_currency') || 'USD';
  });
  const [subscriptionRevision, setSubscriptionRevision] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const subscription = useMemo(() => {
    if (!user) return { plan: 'Free', expiresAt: null as string | null };
    if (typeof window === 'undefined')
      return { plan: 'Free', expiresAt: null as string | null };
    const key = `hostinly_subscription_${user.email.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      return { plan: 'Free', expiresAt: expiresAt.toISOString() };
    }
    try {
      const parsed = JSON.parse(raw) as { plan?: string; expiresAt?: string };
      return { plan: parsed.plan || 'Free', expiresAt: parsed.expiresAt || null };
    } catch {
      return { plan: 'Free', expiresAt: null };
    }
  }, [user, subscriptionRevision]);

  const handlePlanChange = (plan: string) => {
    if (!user) return;
    const key = `hostinly_subscription_${user.email.toLowerCase()}`;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    localStorage.setItem(
      key,
      JSON.stringify({ plan, expiresAt: expiresAt.toISOString() })
    );
    setSubscriptionRevision((r) => r + 1);
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('hostinly_currency', newCurrency);
  };

  const convertAmount = (amount: number) => {
    const converted = amount * (CURRENCY_RATES[currency] || 1);
    return currency === 'JPY' ? Math.round(converted) : converted.toFixed(2);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Mock billing data
  const billingInfo: BillingInfo = {
    cardType: 'Visa',
    cardLast4: '4242',
    cardExpiry: '12/26',
    totalPaid: 15340,
    pendingBalance: 1250,
    overdueBalance: 0,
  };

  const invoices: Invoice[] = [
    {
      id: 'INV-001',
      date: '2026-04-01',
      amount: 1250.00,
      status: 'pending',
      description: 'Monthly hosting fees - April 2026',
    },
    {
      id: 'INV-002',
      date: '2026-03-01',
      amount: 1150.00,
      status: 'paid',
      description: 'Monthly hosting fees - March 2026',
    },
    {
      id: 'INV-003',
      date: '2026-02-01',
      amount: 1200.00,
      status: 'paid',
      description: 'Monthly hosting fees - February 2026',
    },
    {
      id: 'INV-004',
      date: '2026-01-01',
      amount: 1100.00,
      status: 'paid',
      description: 'Monthly hosting fees - January 2026',
    },
    {
      id: 'INV-005',
      date: '2025-12-01',
      amount: 1200.00,
      status: 'paid',
      description: 'Monthly hosting fees - December 2025',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'overdue':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div>
        {/* Header with Currency Selector */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Billing & Payments</h1>
            <p className="text-muted-foreground">Manage your payments, invoices, and billing information</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background text-sm font-medium text-foreground">
                Plan: {subscription.plan}
              </div>
              <div className="text-sm text-muted-foreground">
                Expires:{' '}
                {subscription.expiresAt
                  ? new Date(subscription.expiresAt).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    )
                  : '—'}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={subscription.plan}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Business">Business</option>
                </select>
                <a
                  href="/pricing"
                  className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  View pricing
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-background border border-border rounded-lg p-3">
            <Globe size={20} className="text-muted-foreground" />
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="bg-background text-foreground font-medium focus:outline-none cursor-pointer"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>
        </div>

        {/* Billing Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Paid */}
          <div className="bg-background rounded-lg shadow-medium border border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                <p className="text-3xl font-bold text-foreground">{CURRENCY_SYMBOLS[currency]}{convertAmount(billingInfo.totalPaid)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Pending Balance */}
          <div className="bg-background rounded-lg shadow-medium border border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Balance</p>
                <p className="text-3xl font-bold text-foreground">{CURRENCY_SYMBOLS[currency]}{convertAmount(billingInfo.pendingBalance)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Overdue Balance */}
          <div className="bg-background rounded-lg shadow-medium border border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overdue Balance</p>
                <p className="text-3xl font-bold text-foreground">{CURRENCY_SYMBOLS[currency]}{convertAmount(billingInfo.overdueBalance)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-background rounded-lg shadow-medium border border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              Payment Method
            </h2>
            <button className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
              Update Card
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{billingInfo.cardType} ending in {billingInfo.cardLast4}</p>
              <p className="text-sm text-muted-foreground">Expires {billingInfo.cardExpiry}</p>
            </div>
          </div>
        </div>

        {/* Invoices Section */}
        <div className="bg-background rounded-lg shadow-medium border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Invoice History</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Invoice</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Amount</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{invoice.id}</td>
                    <td className="py-3 px-4 text-foreground">
                      {new Date(invoice.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{invoice.description}</td>
                    <td className="py-3 px-4 text-right text-foreground font-semibold">
                      {CURRENCY_SYMBOLS[currency]}{convertAmount(invoice.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusIcon(invoice.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          invoice.status
                        )}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button className="flex items-center justify-center gap-2 px-3 py-1 rounded-lg hover:bg-muted transition-colors text-foreground">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Pay Section */}
        {billingInfo.pendingBalance > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Outstanding Balance</h3>
                <p className="text-blue-800">You have a pending balance of {CURRENCY_SYMBOLS[currency]}{convertAmount(billingInfo.pendingBalance)}</p>
              </div>
              <button className="px-6 py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                }}
              >
                Pay Now
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
