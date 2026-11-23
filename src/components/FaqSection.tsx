import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is an IMEI?',
    answer:
      'An IMEI (International Mobile Equipment Identity) is a unique 14 or 15-digit serial number assigned to every cellular mobile device to identify its hardware profile.',
  },
  {
    question: 'How do I find my IMEI?',
    answer:
      'Open your phone dialer and dial *#06#, or check Settings → About Phone. If you cannot access the device, open the SIM card slot and check the SIM tray for the IMEI number printed on it.',
  },
  {
    question: 'Can I enter a 14-digit IMEI?',
    answer:
      'Yes. Both 14-digit IMEI/MEID identifiers and standard 15-digit IMEI numbers are supported by the iUnlocker verification tool.',
  },
  {
    question: 'Can I enter a 15-digit IMEI?',
    answer:
      'Yes. Most modern smartphones use a 15-digit IMEI including the Luhn check digit, and the input field accepts up to 15 numeric digits.',
  },
  {
    question: 'What does Unlock Your Blocked Phone check?',
    answer:
      'It verifies your device hardware identity and outlines supported iCloud unlock options for your blocked phone.',
  },
  {
    question: 'What is a network lock unlock?',
    answer:
      'Unlocking a network lock removes carrier SIM restrictions so a compatible device can operate with SIM cards or eSIM profiles from other wireless providers.',
  },
  {
    question: 'How does IMEI verification work?',
    answer:
      'Your entered 14 or 15-digit IMEI is validated in real time to return your device name, brand, model number, and verification status.',
  },
  {
    question: 'How can I contact support?',
    answer:
      'Use the Contact & Support form directly below to send your inquiry along with your service type and optional IMEI reference.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-16 sm:py-20 px-4 sm:px-6 border-t border-[#D2D2D7] bg-white"
    >
      <div className="max-w-[680px] mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#1D1D1F]">
            Frequently Asked Questions
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#6E6E73]">
            Clear answers on IMEI formatting, verification results, and unlock support.
          </p>
        </div>

        <div className="rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] divide-y divide-[#D2D2D7] overflow-hidden">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1D1D1F]"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#1D1D1F]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6E6E73] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#1D1D1F]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-sm text-[#6E6E73] leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
