"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqCategories = [
  {
    title: "For Property Owners (Hosts)",
    items: [
      {
        question: "What is Hostinly?",
        answer: "Hostinly is a platform that connects Airbnb and short-let property owners with trusted co-hosts, cleaners, and maintenance professionals. We make it easy to find, hire, and manage reliable support for your property."
      },
      {
        question: "Who is Hostinly for?",
        answer: "Hostinly is designed for Airbnb and short-let property owners, busy landlords, portfolio property managers, and investors who want hands-free management."
      },
      {
        question: "How does Hostinly work?",
        answer: "1. Create an account\n2. Post your service requirement\n3. Browse verified service providers\n4. Compare profiles, reviews & pricing\n5. Connect and hire"
      },
      {
        question: "What services can I find on Hostinly?",
        answer: "Cleaning services, Co-hosting & guest communication, Check-in & check-out coordination, Property inspections, Maintenance & repairs, Linen & restocking services, Calendar & pricing management."
      },
      {
        question: "Are service providers vetted?",
        answer: "Yes. Hostinly verifies providers through identity checks, references, and profile reviews to ensure quality and trust."
      },
      {
        question: "How much does it cost to use Hostinly?",
        answer: "Free account registration. Platform service fee on confirmed bookings. Optional premium subscription for priority listings and advanced tools."
      },
      {
        question: "Can I manage multiple properties?",
        answer: "Yes. Hostinly allows you to manage multiple properties from one dashboard."
      },
      {
        question: "How do payments work?",
        answer: "Payments are securely processed through the platform. Funds are released to service providers after job confirmation."
      },
      {
        question: "What if I’m not satisfied with a service?",
        answer: "Hostinly offers dispute resolution support to ensure fair outcomes for both hosts and service providers."
      },
      {
        question: "Is Hostinly only for Airbnb?",
        answer: "No. Hostinly supports Airbnb, Booking.com, Vrbo, serviced apartments, and other short-term rental platforms."
      }
    ]
  },
  {
    title: "For Co-Hosts & Cleaners",
    items: [
      {
        question: "How do I join Hostinly as a service provider?",
        answer: "Sign up, complete your profile, upload verification documents, list your services, and start receiving job requests."
      },
      {
        question: "Do I need experience?",
        answer: "Yes. Relevant experience in cleaning, property management, or hospitality is required. Profiles with reviews and references perform best."
      },
      {
        question: "How do I get paid?",
        answer: "You get paid securely through the Hostinly platform once the service is completed and approved."
      },
      {
        question: "Are there fees for service providers?",
        answer: "Yes. Hostinly charges a small commission on completed jobs. Premium listing upgrades are optional."
      },
      {
        question: "Can I choose my own rates?",
        answer: "Yes. You set your own pricing and availability."
      },
      {
        question: "Can I work with multiple property owners?",
        answer: "Absolutely. Hostinly allows you to connect with multiple hosts to grow your business."
      }
    ]
  },
  {
    title: "Safety & Trust",
    items: [
      {
        question: "How does Hostinly ensure safety?",
        answer: "ID verification, Review & rating system, Secure messaging, Payment protection, Dispute resolution support."
      },
      {
        question: "Is my data secure?",
        answer: "Yes. We use secure encryption and data protection practices to safeguard your information."
      }
    ]
  },
  {
    title: "Business & Growth",
    items: [
      {
        question: "Can Hostinly help me scale my Airbnb business?",
        answer: "Yes. By outsourcing operations like cleaning and guest communication, you can scale faster and operate more efficiently."
      },
      {
        question: "Does Hostinly offer business tools?",
        answer: "Premium members gain access to performance insights, booking analytics, revenue tracking, and service provider performance metrics."
      },
      {
        question: "Where does Hostinly operate?",
        answer: "Hostinly is expanding across the UK and internationally. Check your location availability during sign-up."
      }
    ]
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");
  const [openCategories, setOpenCategories] = useState<number[]>([0]);

  const toggleFaq = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggleCategory = (idx: number) => {
    setOpenCategories(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section id="faq" className="py-20 w-full bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#1A6653]">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#666666]">
            Everything you need to know about Hostinly.
          </p>
        </div>

        <div className="space-y-6">
          {faqCategories.map((category, catIdx) => {
            const isCatOpen = openCategories.includes(catIdx);
            
            return (
              <div key={catIdx} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleCategory(catIdx)}
                  className={`w-full flex items-center justify-between p-6 text-left transition-colors ${
                    isCatOpen ? "bg-[#1A6653] text-white" : "bg-[#F8FBFD] text-[#1A6653] hover:bg-gray-50"
                  }`}
                >
                  <h3 className="text-xl font-bold">
                    {category.title}
                  </h3>
                  {isCatOpen ? (
                    <ChevronUp className="h-6 w-6 shrink-0" />
                  ) : (
                    <ChevronDown className="h-6 w-6 shrink-0" />
                  )}
                </button>
                
                {isCatOpen && (
                  <div className="p-6 bg-white space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {category.items.map((item, itemIdx) => {
                      const id = `${catIdx}-${itemIdx}`;
                      const isOpen = openIndex === id;

                      return (
                        <div
                          key={id}
                          className={`border border-gray-100 rounded-2xl transition-all ${
                            isOpen ? "bg-[#F8FBFD] border-[#38B2AC]/20 shadow-sm" : "bg-white hover:border-gray-200"
                          }`}
                        >
                          <button
                            onClick={() => toggleFaq(id)}
                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                          >
                            <span className={`font-semibold ${isOpen ? "text-[#1A6653]" : "text-gray-800"}`}>
                              {item.question}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-[#38B2AC] shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
