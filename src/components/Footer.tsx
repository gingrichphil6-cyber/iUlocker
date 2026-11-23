import React, { useState } from 'react';
import { Globe, MessageSquare, Share2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { AppView } from '../types';
import { BrandLogo } from './ui/BrandLogo';
import { RippleButton } from './ui/RippleButton';

interface FooterProps {
  onNavigateView: (view: AppView, sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateView }) => {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const navLinks: { label: string; sectionId: string }[] = [
    { label: 'Home', sectionId: 'top' },
    { label: 'Services', sectionId: 'services' },
    { label: 'FAQ', sectionId: 'faq' },
    { label: 'Support', sectionId: 'support' },
  ];

  return (
    <>
      <footer className="border-t border-[#D2D2D7] bg-[#F5F5F7] py-10 px-4 sm:px-6">
        <div className="max-w-[720px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <BrandLogo onClick={() => onNavigateView('home', 'top')} />
              <p className="mt-1.5 text-xs text-[#6E6E73]">
                Unlock possibilities.
              </p>
            </div>

            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#6E6E73]"
            >
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => onNavigateView('home', link.sectionId)}
                  className="hover:text-[#1D1D1F] transition-colors whitespace-nowrap cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setLegalModal('privacy')}
                className="hover:text-[#1D1D1F] transition-colors whitespace-nowrap cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('terms')}
                className="hover:text-[#1D1D1F] transition-colors whitespace-nowrap cursor-pointer"
              >
                Terms of Service
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="iUnlocker web portal"
                onClick={() => onNavigateView('home', 'support')}
                className="w-8 h-8 rounded-lg bg-white border border-[#D2D2D7] flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] hover:border-[#1D1D1F]/40 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="iUnlocker messaging support"
                onClick={() => onNavigateView('home', 'support')}
                className="w-8 h-8 rounded-lg bg-white border border-[#D2D2D7] flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] hover:border-[#1D1D1F]/40 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Share iUnlocker"
                onClick={() => onNavigateView('home', 'support')}
                className="w-8 h-8 rounded-lg bg-white border border-[#D2D2D7] flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] hover:border-[#1D1D1F]/40 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="pt-5 border-t border-[#D2D2D7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#6E6E73]">
            <p>© 2026 iUnlocker. All rights reserved.</p>
            <p>Precision IMEI verification &amp; unlock support.</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {legalModal && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setLegalModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl bg-white border border-[#D2D2D7] p-6 sm:p-7"
            >
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                aria-label="Close policy dialog"
                className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <h3
                id="legal-modal-title"
                className="text-xl font-bold text-[#1D1D1F]"
              >
                {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <div className="mt-3 space-y-3 text-sm text-[#6E6E73] leading-relaxed">
                {legalModal === 'privacy' ? (
                  <>
                    <p>
                      iUnlocker respects your privacy. IMEI numbers are partially masked in summaries and processed strictly to verify device compatibility and unlock support options.
                    </p>
                    <p>
                      Submitted IMEI details can be reviewed or cleared anytime by contacting Support.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      iUnlocker provides IMEI verification and unlock support. By using the service, you confirm that you are the authorized owner of any submitted device IMEI.
                    </p>
                    <p>
                      Payments via Binance Pay are processed according to the selected service tier.
                    </p>
                  </>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <RippleButton
                  variant="primary"
                  size="sm"
                  onClick={() => setLegalModal(null)}
                >
                  Close
                </RippleButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
