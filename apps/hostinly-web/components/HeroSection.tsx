import { Button } from "@/components/ui/button";
import { Home, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-16" style={{
      backgroundImage: 'url(/images/hero-background.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-1">
            Connect Airbnb Hosts
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              with Expert Co-Hosts
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-white mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Hostinly connects property owners with experienced co-hosts to
            manage your short-term rentals. List your property or find
            properties to manage.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 px-2">
            <Button
              variant="secondary"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Home className="mr-2 h-5 w-5" />
              I&apos;m a Property Owner
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white hover:text-primary [&_svg]:text-white hover:[&_svg]:text-primary"
            >
              <Users className="mr-2 h-5 w-5 shrink-0" />
              I&apos;m a Co-Host
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto px-2">
            <div className="flex flex-col items-center bg-white/10 rounded-xl p-5 sm:p-6 backdrop-blur-sm text-white">
              <Home className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">For Hosts</h3>
              <p className="text-white/90 text-center">
                List your property and find trusted co-hosts to manage your
                Airbnb
              </p>
            </div>
            <div className="flex flex-col items-center bg-white/10 rounded-xl p-5 sm:p-6 backdrop-blur-sm text-white">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">For Co-Hosts</h3>
              <p className="text-white/90 text-center">
                Browse available properties and grow your property management
                portfolio
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
