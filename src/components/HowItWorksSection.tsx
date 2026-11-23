import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Select Your Device',
      description: 'Pick any iPhone, iPad, or Apple Watch model up to the 2026 series.',
      illustration: (
        <svg
          viewBox="0 0 120 72"
          className="w-full h-16"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="8"
            y="14"
            width="104"
            height="44"
            rx="10"
            fill="#FFFFFF"
            stroke="#D2D2D7"
            strokeWidth="1.5"
          />
          <text
            x="18"
            y="40"
            fill="#1D1D1F"
            fontSize="10.5"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            letterSpacing="0.8"
          >
            iPhone 16 Pro
          </text>
          <rect x="99" y="27" width="1.75" height="18" rx="0.8" fill="#1D1D1F" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Choose Service & IMEI',
      description: 'Select your unlock service and enter your 15-digit IMEI.',
      illustration: (
        <svg
          viewBox="0 0 120 72"
          className="w-full h-16"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="8"
            y="12"
            width="48"
            height="48"
            rx="9"
            fill="#FFFFFF"
            stroke="#1D1D1F"
            strokeWidth="1.5"
          />
          <circle cx="32" cy="30" r="8" fill="#1D1D1F" />
          <path
            d="M28.5 30L31 32.5L35.5 28"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="19" y="45" width="26" height="4" rx="2" fill="#1D1D1F" />

          <rect
            x="64"
            y="12"
            width="48"
            height="48"
            rx="9"
            fill="#FFFFFF"
            stroke="#D2D2D7"
            strokeWidth="1.2"
          />
          <circle cx="88" cy="30" r="8" stroke="#D2D2D7" strokeWidth="1.5" />
          <rect x="75" y="45" width="26" height="4" rx="2" fill="#D2D2D7" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Scan to Pay & Submit',
      description: 'Scan the QR code and upload your payment receipt screenshot.',
      illustration: (
        <svg
          viewBox="0 0 120 72"
          className="w-full h-16"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="10"
            y="10"
            width="100"
            height="52"
            rx="10"
            fill="#FFFFFF"
            stroke="#D2D2D7"
            strokeWidth="1.5"
          />
          <circle cx="31" cy="36" r="10.5" fill="#1D1D1F" />
          <path
            d="M26.5 36L29.5 39L35.5 33"
            stroke="#FFFFFF"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="50" y="25" width="46" height="5" rx="2.5" fill="#1D1D1F" />
          <rect x="50" y="35" width="34" height="4" rx="2" fill="#6E6E73" fillOpacity="0.45" />
          <rect x="50" y="44" width="24" height="4" rx="2" fill="#D2D2D7" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-20 px-4 sm:px-6 border-t border-[#D2D2D7] bg-white"
    >
      <div className="max-w-[680px] mx-auto">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#1D1D1F]">
            How it works
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#6E6E73] leading-relaxed">
            Three clear steps to verify your device profile and explore available unlock options.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] p-5 transition-colors hover:border-[#1D1D1F]/35"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                  Step {step.num}
                </span>
              </div>

              <div className="rounded-xl bg-white border border-[#D2D2D7] p-2.5 mb-4">
                {step.illustration}
              </div>

              <h3 className="text-base font-semibold tracking-[-0.01em] text-[#1D1D1F]">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#6E6E73] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
