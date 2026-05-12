'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, AlertCircle, CheckCircle, Globe } from 'lucide-react';


interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  plan: string;
}

const mockInvoices: Invoice[] = [
  { id: 'INV-2024-001', date: '2024-03-01', amount: 29.00, status: 'Paid', plan: 'Professional' },
  { id: 'INV-2024-002', date: '2024-02-01', amount: 29.00, status: 'Paid', plan: 'Professional' },
  { id: 'INV-2024-003', date: '2024-01-01', amount: 29.00, status: 'Paid', plan: 'Professional' },
];

export default function BillingPage() {
  const { user, isLoading } = useAuth();
  const [subscription, setSubscription] = useState({ plan: 'Free', status: 'Active', nextBilling: '2024-04-01' });

  useEffect(() => {
    const emailKey = user?.email?.toLowerCase();
    if (emailKey) {
      const stored = localStorage.getItem(`hostinly_subscription_${emailKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSubscription(prev => ({ ...prev, plan: parsed.plan }));
      }
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your payment methods and subscription plans</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Current Plan & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Plan Card */}
            <div className="bg-background rounded-xl shadow-medium border border-border overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Current Plan</h2>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                    {subscription.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-4xl font-bold text-foreground">{subscription.plan}</span>
                  <span className="text-muted-foreground mb-1">Plan</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <AlertCircle size={16} className="text-blue-500" />
                  Your next billing date is {subscription.nextBilling}
                </div>
                <div className="flex gap-4">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">Cancel Subscription</Button>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-background rounded-xl shadow-medium border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Payment Method</h2>
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/20">
                <div className="w-12 h-8 bg-foreground/5 rounded flex items-center justify-center border border-border">
                  <CreditCard className="text-foreground/40" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/26</p>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-background rounded-xl shadow-medium border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">Billing History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30 border-b border-border text-left">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Invoice</th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{invoice.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{invoice.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">${invoice.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            invoice.status === 'Paid' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : invoice.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {invoice.status === 'Paid' && <CheckCircle size={12} />}
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 ml-auto">
                            <Download size={14} />
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Plan Comparison/Upgrade */}
          <div className="space-y-6">
            <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
              <h3 className="font-bold text-foreground text-lg mb-4">Why upgrade?</h3>
              <ul className="space-y-3">
                {[
                  'Unlimited property listings',
                  'Verified badge on profile',
                  'Priority search placement',
                  'Automated message templates',
                  'No commission on first 3 bookings'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <CheckCircle className="text-primary shrink-0 mt-0.5" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background rounded-xl border border-border p-6 shadow-medium">
              <Globe className="text-primary mb-4" size={32} />
              <h3 className="font-bold text-foreground text-lg mb-2">Tax Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Update your business details and tax ID for correct invoicing across regions.
              </p>
              <Button variant="outline" className="w-full">Update Details</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
