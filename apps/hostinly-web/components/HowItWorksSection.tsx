import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, Handshake, TrendingUp } from "lucide-react";

const hostSteps = [
  {
    step: "01",
    icon: Home,
    title: "List Your Property",
    description:
      "Add your Airbnb property details, photos, and co-hosting requirements.",
  },
  {
    step: "02",
    icon: Search,
    title: "Review Applications",
    description:
      "Receive applications from verified co-hosts and review their profiles.",
  },
  {
    step: "03",
    icon: Handshake,
    title: "Choose Your Co-Host",
    description:
      "Select the best match and agree on terms and commission rates.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Earn Passive Income",
    description:
      "Sit back while your co-host manages everything and you earn income.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-[#F8FBFD]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#1A6653]">
            How Hostinly Works
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-[#666666]">
            Simple steps to connect property owners with experienced co-hosts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {hostSteps.map((step) => (
            <Card
              key={step.step}
              className="relative overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl transition-all hover:shadow-md"
            >
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="absolute top-0 right-0 text-6xl sm:text-7xl font-bold text-gray-100 -mr-2 -mt-2 select-none">
                  {step.step}
                </div>

                <div className="relative z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#38B2AC] rounded-2xl flex items-center justify-center mx-auto mb-5 mt-2 rotate-3 hover:rotate-0 transition-transform">
                    <step.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>

                  <h3 className="text-lg font-bold mb-3 text-[#1A6653]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-[#38B2AC] hover:bg-[#319795] !text-white rounded-full px-10 py-6 text-base font-bold"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
}
