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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {hostSteps.map((step) => (
            <Card
              key={step.step}
              className="relative overflow-hidden bg-white border-1 !border-gray-200 shadow-sm rounded-xl"
            >
              <CardContent className="p-6 text-center">
                <div className="absolute top-0 right-0 text-7xl font-bold text-gray-200/80 -mr-2 -mt-2 select-none">
                  {step.step}
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#38B2AC] rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-[#1A6653]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#333333]">
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
