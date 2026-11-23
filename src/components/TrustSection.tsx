import React from 'react';
import { Eye, Headphones, Lock, Workflow } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      title: 'Secure Information Handling',
      description:
        'IMEI entries are masked in result summaries and handled cleanly with privacy in mind.',
      icon: <Lock className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />,
    },
    {
      title: 'Transparent Results',
      description:
        'Every check clearly outlines device model details, validity status, and supported unlock options upfront.',
      icon: <Eye className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />,
    },
    {
      title: 'Simple Process',
      description:
        'Validate 14 or 15-digit IMEIs in seconds with guided formatting and instant service selection.',
      icon: <Workflow className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />,
    },
    {
      title: 'Dedicated Support',
      description:
        'Reach our support team through the built-in contact workflow for guidance on device unlock options.',
      icon: <Headphones className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />,
    },
  ];

  return (
    <section
      id="services"
      aria-label="Trust and platform principles"
      className="py-16 sm:py-20 px-4 sm:px-6 border-t border-[#D2D2D7] bg-white"
    >
      <div className="max-w-[680px] mx-auto">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#1D1D1F]">
            Built for clarity and trust
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#6E6E73] leading-relaxed">
            Honest device verification workflows without hidden steps, misleading claims, or cluttered interfaces.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] p-5 transition-colors hover:border-[#1D1D1F]/35"
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-[#D2D2D7] flex items-center justify-center mb-4">
                {item.icon}
              </div>

              <h3 className="text-base font-semibold tracking-[-0.01em] text-[#1D1D1F]">
                {item.title}
              </h3>

              <p className="mt-1.5 text-sm text-[#6E6E73] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
