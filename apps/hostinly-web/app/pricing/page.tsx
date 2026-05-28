export const dynamic = "force-dynamic";
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

type Tier = {
  name: string;
  price: string;
  whoFor: string;
  highlights: string[];
};

const tiers: Tier[] = [
  {
    name: 'Free',
    price: '£0',
    whoFor: '1 property, limited matches',
    highlights: [
      'Basic matching',
      'Standard response times',
      'Limited insights',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '£20/mo',
    whoFor: 'Serious hosts (2–5 listings)',
    highlights: [
      'Priority matching',
      'Faster provider responses',
      'Performance tracking',
      'Calendar sync (Airbnb)',
    ],
  },
  {
    name: 'Business',
    price: '£50/mo',
    whoFor: 'Multi-property owners',
    highlights: [
      'Highest priority matching',
      'Advanced performance tracking',
      'Dedicated support channel',
      'Multi-location coverage',
    ],
  },
];

const featureRows = [
  { label: 'Properties included', free: '1', pro: '2–5', business: '6+' },
  {
    label: 'Matching priority',
    free: 'Standard',
    pro: 'Priority',
    business: 'Highest',
  },
  {
    label: 'Calendar sync (Airbnb)',
    free: '—',
    pro: '✓',
    business: '✓',
  },
  {
    label: 'Faster provider responses',
    free: '—',
    pro: '✓',
    business: '✓',
  },
  {
    label: 'Performance tracking',
    free: 'Basic',
    pro: 'Advanced',
    business: 'Advanced + export',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8FBFD]">
      <Navigation />

      <main className="pt-24 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(40,100%,96%)] border border-[hsl(40,80%,88%)] text-[hsl(40,90%,35%)] text-sm font-medium mb-6">
              Pricing
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[hsl(195,60%,22%)] tracking-tight mb-5">
              Flexible plans for every host
            </h1>
            <p className="text-lg text-[hsl(195,20%,35%)] max-w-2xl mx-auto">
              Pay for what you need: priority matching, calendar sync, faster
              responses, and performance tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="bg-white rounded-2xl border border-gray-200 shadow-soft p-7 flex flex-col"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[hsl(195,60%,22%)]">
                      {tier.name}
                    </h2>
                    <p className="text-sm text-[hsl(195,20%,35%)] mt-1">
                      {tier.whoFor}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[hsl(195,60%,22%)]">
                      {tier.price}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      billed monthly
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-[hsl(195,20%,35%)]">
                  {tier.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2">
                      <span className="mt-[2px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(180,41%,92%)] text-[hsl(195,60%,25%)] text-xs">
                        ✓
                      </span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link href="/auth/signup?role=host">
                    <Button
                      className="w-full rounded-lg border-0"
                      style={{
                        background:
                          'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                        color: '#ffffff',
                      }}
                    >
                      Get started
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-[hsl(195,60%,22%)]">
                Plan comparison
              </h3>
              <p className="text-sm text-[hsl(195,20%,35%)] mt-2">
                What you pay for: priority matching, calendar sync (Airbnb),
                faster provider responses, and performance tracking.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-[hsl(180,100%,99.8%)]">
                    <th className="py-4 px-6 font-semibold text-foreground">
                      Feature
                    </th>
                    <th className="py-4 px-6 font-semibold text-foreground">
                      Free
                    </th>
                    <th className="py-4 px-6 font-semibold text-foreground">
                      Pro
                    </th>
                    <th className="py-4 px-6 font-semibold text-foreground">
                      Business
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {featureRows.map((row) => (
                    <tr key={row.label} className="border-t border-gray-200">
                      <td className="py-4 px-6 text-foreground font-medium">
                        {row.label}
                      </td>
                      <td className="py-4 px-6 text-[hsl(195,20%,35%)]">
                        {row.free}
                      </td>
                      <td className="py-4 px-6 text-[hsl(195,20%,35%)]">
                        {row.pro}
                      </td>
                      <td className="py-4 px-6 text-[hsl(195,20%,35%)]">
                        {row.business}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/auth/signup?role=host">
              <Button
                size="lg"
                className="rounded-lg border-0"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                  color: '#ffffff',
                }}
              >
                Create an account
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground mt-3">
              You can upgrade anytime from your dashboard.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

