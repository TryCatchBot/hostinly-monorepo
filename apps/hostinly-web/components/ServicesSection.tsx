import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Calendar,
  DollarSign,
  Clock,
  Shield,
  Star,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Guest Communication",
    description:
      "Co-hosts handle all guest inquiries, bookings, and reviews professionally.",
  },
  {
    icon: Calendar,
    title: "Booking Management",
    description:
      "Manage calendars, availability, and reservations across platforms.",
  },
  {
    icon: DollarSign,
    title: "Pricing Optimization",
    description:
      "Dynamic pricing strategies to maximize your rental income.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Round-the-clock guest support for seamless hosting experience.",
  },
  {
    icon: Shield,
    title: "Verified Professionals",
    description:
      "All co-hosts are vetted and background-checked for your peace of mind.",
  },
  {
    icon: Star,
    title: "Performance Tracking",
    description:
      "Track bookings, reviews, and revenue with detailed analytics.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-[linear-gradient(180deg,hsl(0_0%_100%),hsl(180_15%_98%))]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[hsl(195,60%,25%)]">
            What Co-Hosts Do For You
          </h2>
          <p className="text-lg text-[hsl(195,60%,25%)]   max-w-2xl mx-auto">
            Professional co-hosts handle everything so you can enjoy passive
            income from your property.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="h-full bg-white border border-gray-100 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] rounded-2xl"
            >
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 mt-2 rotate-3 hover:rotate-0 transition-transform shadow-md">
                  <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-[hsl(195,60%,25%)]">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
